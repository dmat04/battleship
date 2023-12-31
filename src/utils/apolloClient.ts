import { ApolloClient, InMemoryCache } from '@apollo/client';

const createApolloClient = () => new ApolloClient({
  uri: 'http://localhost:4000',
  cache: new InMemoryCache(),
  defaultOptions: {
    mutate: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
    watchQuery: {
      errorPolicy: 'all',
    },
  },
});

export default createApolloClient;
