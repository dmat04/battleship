import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { ApolloProvider } from "@apollo/client";
import App from "./App.js";
import { setupStore } from "./store/store.js";
import createApolloClient from "./utils/apolloClient.js";
import Dependencies from "./utils/Dependencies.js";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

const store = setupStore();

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
