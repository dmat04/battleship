import { describe, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import CollapsibleContainer, { CollapsibleAPI, CollapsibleState } from "./index.js";
import React from "react";

describe("The CollapsibleContainer component", () => {
  const ChildComponent = <div data-testid="child">Hello World</div>;

  it(`Renders the child component in a visible state
    when rendered with an initialState value of 'open'`, () => {
    render(
      <CollapsibleContainer initialState="open">
        {ChildComponent}
      </CollapsibleContainer>,
    );
    const childElement = screen.getByTestId("child");

    expect(childElement).toBeInTheDocument();
    expect(childElement).toBeVisible();
  });

  it(`Renders the child component in an invisible state
    when rendered with an initialState value of 'closed'`, () => {
    render(
      <CollapsibleContainer initialState="closed">
        {ChildComponent}
      </CollapsibleContainer>,
    );
    const childElement = screen.getByTestId("child");

    expect(childElement).toBeInTheDocument();
    expect(childElement).not.toBeVisible();
  });

  describe(`Its imperative API`, () => {
    it.each([
      { initialState: "open", finalState: "closed", calls: ["closed"] },
      { initialState: "closed", finalState: "open", calls: ["open"] },
      { initialState: "open", finalState: "open", calls: [] },
      { initialState: "closed", finalState: "closed", calls: [] },
    ])(
      `correctly changes the child components visibility state when setting state from
      $initialState to $finalState`,
      async ({ initialState, finalState, calls }) => {
        const imperativeAPI = React.createRef<CollapsibleAPI>();
        const stateChangeObserver = vi.fn();

        render(
          <CollapsibleContainer
            ref={imperativeAPI}
            onCollapsedStateChange={stateChangeObserver}
            initialState={initialState as CollapsibleState}
          >
            {ChildComponent}
          </CollapsibleContainer>,
        );

        const childElement = screen.getByTestId("child");
        expect(stateChangeObserver.mock.calls).toHaveLength(0);
        expect(imperativeAPI.current?.getState()).toEqual(initialState);
        expect(childElement).toBeInTheDocument();
        if (initialState === "open") {
          expect(childElement).toBeVisible();
        } else {
          expect(childElement).not.toBeVisible();
        }
        
        imperativeAPI.current?.setState(finalState as CollapsibleState);

        expect(stateChangeObserver.mock.calls).toHaveLength(calls.length);
        if (calls.length > 0) {
          expect(stateChangeObserver.mock.calls[0]).toEqual(calls);
        }
        expect(imperativeAPI.current?.getState()).toBe(finalState);
        expect(childElement).toBeInTheDocument();
        if (finalState === "closed") {
          await waitFor(() => expect(childElement).not.toBeVisible());
        } else {
          await waitFor(() => expect(childElement).toBeVisible());
        }
      },
    );

    it.each([
      { initialState: "open", finalState: "closed" },
      { initialState: "closed", finalState: "open" },
    ])(
      `correctly changes the child components visibility state when toggling state from
      $initialState to $finalState`,
      async ({ initialState, finalState }) => {
        const imperativeAPI = React.createRef<CollapsibleAPI>();
        const stateChangeObserver = vi.fn();

        render(
          <CollapsibleContainer
            ref={imperativeAPI}
            onCollapsedStateChange={stateChangeObserver}
            initialState={initialState as CollapsibleState}
          >
            {ChildComponent}
          </CollapsibleContainer>,
        );

        const childElement = screen.getByTestId("child");
        expect(stateChangeObserver.mock.calls).toHaveLength(0);
        expect(imperativeAPI.current?.getState()).toEqual(initialState);
        expect(childElement).toBeInTheDocument();
        if (initialState === "open") {
          expect(childElement).toBeVisible();
        } else {
          expect(childElement).not.toBeVisible();
        }        

        imperativeAPI.current?.toggleState();

        expect(stateChangeObserver.mock.calls).toHaveLength(1);
        expect(stateChangeObserver.mock.calls[0]).toEqual([finalState]);
        expect(imperativeAPI.current?.getState()).toBe(finalState);
        expect(childElement).toBeInTheDocument();
        if (finalState === "closed") {
          await waitFor(() => expect(childElement).not.toBeVisible());
        } else {
          await waitFor(() => expect(childElement).toBeVisible());
        }
      },
    );
  });
});
