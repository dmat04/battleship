import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import type { Store } from "../store/store";

class Dependencies {
  private static instance: Dependencies | undefined = undefined;

  private apolloClient: ApolloClient<NormalizedCacheObject> | undefined;

  private store: Store | undefined;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static setApolloClient = (
    client: ApolloClient<NormalizedCacheObject>,
  ) => {
    if (this.instance === undefined) {
      this.instance = new Dependencies();
    }

    this.instance.apolloClient = client;
  };

  public static getApolloClient = () => this.instance?.apolloClient;

  public static setStore = (store: Store) => {
    if (this.instance === undefined) {
      this.instance = new Dependencies();
    }

    this.instance.store = store;
  };

  public static getStore = () => this.instance?.store;
}

export default Dependencies;
