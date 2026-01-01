/**
 * Apollo Client Configuration for Storefront App
 * Handles GraphQL communication with the backend
 */

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  ApolloLink,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';

// GraphQL endpoint - change this to your actual GraphQL server URL
const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

// HTTP link for GraphQL requests
const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: 'include', // Include cookies for authentication
});

// Auth middleware to add token to requests
const authLink = new ApolloLink((operation, forward) => {
  // Get token from localStorage
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  // Add authorization header if token exists
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...(token && { authorization: `Bearer ${token}` }),
    },
  }));

  return forward(operation);
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`
      );

      // Handle authentication errors
      if (extensions?.code === 'UNAUTHENTICATED') {
        // Clear tokens
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }

        // Optionally redirect to login
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Create Apollo Client instance
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            keyArgs: ['search', 'category', 'minPrice', 'maxPrice'],
            merge(existing, incoming, { args }) {
              // Handle pagination - merge results for infinite scroll if needed
              if (!args?.page || args.page === 1) {
                return incoming;
              }
              return {
                ...incoming,
                products: [
                  ...(existing?.products || []),
                  ...(incoming?.products || []),
                ],
              };
            },
          },
          orders: {
            keyArgs: false,
            merge(existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// Helper function to clear cache and reset store
export const resetApolloStore = async () => {
  await apolloClient.clearStore();
};
