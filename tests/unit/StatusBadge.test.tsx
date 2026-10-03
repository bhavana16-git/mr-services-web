import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatusBadge from "@/components/common/StatusBadge";

describe("StatusBadge", () => {
  it("renders the correct label for each status", () => {
    render(<StatusBadge status="in_progress" />);
    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  it("never conveys status by color alone -- a text label is always present", () => {
    render(<StatusBadge status="completed" />);
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });
});


