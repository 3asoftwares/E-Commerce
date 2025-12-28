import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../src/test-utils';
import { Table } from '../../src/components/Table/Table';

interface TestData {
  id: number;
  name: string;
  email: string;
}

const mockColumns = [
  { header: 'ID', accessor: 'id' as keyof TestData },
  { header: 'Name', accessor: 'name' as keyof TestData },
  { header: 'Email', accessor: 'email' as keyof TestData },
];

const mockData: TestData[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];

describe('Table', () => {
  it('renders table with data', () => {
    render(<Table columns={mockColumns} data={mockData} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(<Table columns={mockColumns} data={mockData} />);
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Table columns={mockColumns} data={[]} loading />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows empty message when no data', () => {
    render(<Table columns={mockColumns} data={[]} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('shows custom empty message', () => {
    render(<Table columns={mockColumns} data={[]} emptyMessage="No records found" />);
    expect(screen.getByText('No records found')).toBeInTheDocument();
  });

  it('handles row click', () => {
    const handleRowClick = vi.fn();
    render(<Table columns={mockColumns} data={mockData} onRowClick={handleRowClick} />);
    const row = screen.getByText('John Doe').closest('tr');
    fireEvent.click(row!);
    expect(handleRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  it('applies hoverable class', () => {
    const { container } = render(<Table columns={mockColumns} data={mockData} hoverable />);
    const tbody = container.querySelector('tbody');
    expect(tbody?.querySelector('tr')).toHaveClass('hover:bg-gray-50');
  });

  it('applies striped rows', () => {
    const { container } = render(<Table columns={mockColumns} data={mockData} striped />);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows[1]).toHaveClass('bg-gray-50');
  });

  it('renders custom cell content', () => {
    const customColumns = [
      {
        header: 'Name',
        cell: (row: TestData) => <strong>{row.name}</strong>,
      },
    ];
    render(<Table columns={customColumns} data={mockData} />);
    expect(screen.getByText('John Doe').tagName).toBe('STRONG');
  });

  it('supports label as alias for header', () => {
    const columns = [{ label: 'User Name', accessor: 'name' as keyof TestData }];
    render(<Table columns={columns} data={mockData} />);
    expect(screen.getByText('User Name')).toBeInTheDocument();
  });
});
