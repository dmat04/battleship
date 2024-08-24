import { describe, it } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import React from "react";
import { renderWithStoreProvider } from "../../../test/utils.js";
import { RootState } from "client/src/store/store.js";
import {
  noUser,
  userAuthenticated,
} from "../../../test/reduxStateData/authSliceTestdata.js";
import UserInfo from "./UserInfo.js";

describe("The UserInfo component", () => {
  it("renders nothing when no user is authenticated", () => {
    const preloadedState: Partial<RootState> = { auth: noUser };
    renderWithStoreProvider(<UserInfo />, { preloadedState });

    const container = screen.queryByTestId("container");

    expect(container).toBeNull();
  });

  describe("When there is an authenticated user", () => {
    it("displays the users username", () => {
      const preloadedState: Partial<RootState> = { auth: userAuthenticated };
      renderWithStoreProvider(<UserInfo />, { preloadedState });

      const container = screen.queryByTestId("container");
      const userIcon = screen.queryByTestId("icon-user");
      const logoutButton = screen.queryByTestId("button-logout");

      expect(container).toBeVisible();
      expect(userIcon).toBeVisible();
      expect(logoutButton).toBeVisible();
    });

    it("successfully logs the user out", async () => {
      const preloadedState: Partial<RootState> = { auth: userAuthenticated };
      renderWithStoreProvider(<UserInfo />, { preloadedState });

      const logoutButton = screen.getByTestId("button-logout");

      fireEvent(logoutButton, new MouseEvent("click", { bubbles: true }))

      const container = screen.queryByTestId("container");
      await waitFor(() => expect(container).not.toBeVisible());
    });
  });
});
