import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { store } from '../store/store';

const createApolloClient = () => {
  const httpLink = createHttpLink({
    uri: 'http://localhost:4000',
  });

  const authLink = setContext((_, { headers }) => {
    const token = store.getState().auth?.accessToken;

    if (!token) {
      return { headers };
    }

    return {
      ...headers,
      authorization: `Bearer ${token}`,
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
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

  return client;
};

const apolloClient = createApolloClient();

export default apolloClient;
