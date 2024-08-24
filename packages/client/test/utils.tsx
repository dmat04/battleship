import React, { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import { RenderOptions, render } from "@testing-library/react";
import { type Store, type RootState, setupStore } from "../src/store/store.js";
import themeDefault, {
  Theme,
} from "../src/components/assets/themes/themeDefault.js";
import { ThemeProvider } from "styled-components";


interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: Store;
  theme?: Theme;
}

export const renderWithStoreProvider = (
  ui: React.ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = { },
) => {
  const {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  } = extendedRenderOptions;

  const Wrapper = ({ children }: PropsWithChildren) => (
    <ThemeProvider theme={extendedRenderOptions.theme ?? themeDefault}>
      <Provider store={store}>{children}</Provider>
    </ThemeProvider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};
