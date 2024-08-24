import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Spinner from "./Spinner.js";
import React from "react";

describe("The spinner component", () => {
  it("Displays a spinner animation when rendered", () => {
    render(<Spinner visible/>);

    const element = screen.getByTestId("container");
    expect(element).toBeVisible();
    
    const svgPath = element.children[0].children[1];
    expect(svgPath).toHaveAttribute("class", "spinner_aj0A");
  })
})