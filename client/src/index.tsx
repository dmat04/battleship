import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { ApolloProvider } from "@apollo/client";
import App from "./App";
import { store } from "./store/store";
import createApolloClient from "./utils/apolloClient";
import Dependencies from "./utils/Dependencies";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

Dependencies.setStore(store);

const apolloClient = createApolloClient();
Dependencies.setApolloClient(apolloClient);

root.render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <ReduxProvider store={store}>
        <App />
      </ReduxProvider>
    </ApolloProvider>
  </React.StrictMode>,
);
