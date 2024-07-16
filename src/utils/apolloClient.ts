import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Dependencies from './Dependencies';

const createApolloClient = () => {
  const httpLink = createHttpLink({
    uri: 'http://localhost:4000',
  });

  const authLink = setContext((_, { headers }) => {
    const token = Dependencies.getStore()?.getState().auth?.loginResult?.accessToken;

    if (!token) {
      return { headers };
    }

    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
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

export default createApolloClient;
