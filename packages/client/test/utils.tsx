import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { RenderOptions, render } from "@testing-library/react";
import { type Store, type RootState, setupStore } from "../src/store/store.js";
import themeDefault, {
  Theme,
} from "../src/components/assets/themes/themeDefault.js";
import { ThemeProvider } from "styled-components";
import {
  RouteObject,
  RouterProvider,
  createMemoryRouter,
} from "react-router-dom";
import mockWSMiddleware from "./mockWSMiddleware.js";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  routerRoutes?: RouteObject[];
  store?: Store;
  theme?: Theme;
}

const defaultRoutes: RouteObject[] = [
  {
    path: "/",
    element: <></>,
  },
];

export const renderWithStoreProvider = (
  ui: React.ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {},
) => {
  const {
    preloadedState = {},
    routerRoutes = defaultRoutes,
    store = setupStore(preloadedState, mockWSMiddleware),
    ...renderOptions
  } = extendedRenderOptions;

  const router = createMemoryRouter(routerRoutes, {
    initialEntries: ["/"],
    initialIndex: 0,
  });

  const Wrapper = ({ children }: PropsWithChildren) => (
    <ThemeProvider theme={extendedRenderOptions.theme ?? themeDefault}>
      <Provider store={store}>
        <RouterProvider router={router} />
        {children}
      </Provider>
    </ThemeProvider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};
