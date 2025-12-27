import { atom, selector } from 'recoil';

// Product Filter Atoms
export const searchQueryState = atom<string>({
  key: 'searchQueryState',
  default: '',
});

export const selectedCategoryState = atom<string>({
  key: 'selectedCategoryState',
  default: 'all',
});

export const priceRangeState = atom<{ min: number; max: number }>({
  key: 'priceRangeState',
  default: { min: 0, max: 10000 },
});

export const sortByState = atom<'price_asc' | 'price_desc' | 'name' | 'newest'>({
  key: 'sortByState',
  default: 'newest',
});

// Products Data Atom (populated from TanStack Query)
export const productsDataState = atom<any[]>({
  key: 'productsDataState',
  default: [],
});

// Filtered Products Selector (derived state)
export const filteredProductsState = selector({
  key: 'filteredProductsState',
  get: ({ get }) => {
    const products = get(productsDataState);
    const searchQuery = get(searchQueryState);
    const selectedCategory = get(selectedCategoryState);
    const priceRange = get(priceRangeState);
    const sortBy = get(sortByState);

    let filtered = products;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);

    // Sort
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  },
});

// Categories Selector
export const categoriesState = selector<string[]>({
  key: 'categoriesState',
  get: ({ get }) => {
    const products = get(productsDataState);
    const categories = new Set(products.map((p) => p.category).filter(Boolean));
    return ['all', ...Array.from(categories)];
  },
});
