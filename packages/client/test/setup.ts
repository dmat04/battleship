import "@testing-library/jest-dom/vitest";
import { expect, afterEach, beforeEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import createApolloClient from "../src/utils/apolloClient.js";
import Dependencies from "../src/utils/Dependencies.js";

expect.extend(matchers);

beforeEach(() => {
  const apolloClient = createApolloClient();
  Dependencies.setApolloClient(apolloClient);
});

afterEach(() => {
  cleanup();
});
