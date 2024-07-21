import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  concat,
} from "@apollo/client";
import Dependencies from "./Dependencies";

const createApolloClient = () => {
  const httpLink = new HttpLink({ uri: "http://localhost:4000" });

  const authLink = new ApolloLink((operation, forward) => {
    const token =
      Dependencies.getStore()?.getState().auth?.loginResult?.accessToken;

    if (!token) {
      return forward(operation);
    }

    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        authorization: localStorage.getItem("token") || null,
      },
    }));

    return forward(operation);
  });

  const client = new ApolloClient({
    link: concat(authLink, httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      mutate: {
        errorPolicy: "all",
      },
      query: {
        errorPolicy: "all",
      },
      watchQuery: {
        errorPolicy: "all",
      },
    },
  });

  return client;
};

export default createApolloClient;
