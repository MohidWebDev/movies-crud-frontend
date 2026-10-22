import { ComponentProps } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteModal } from "./DeleteModal";
import { buildMovie } from "../test/factories";

const renderModal = (
  props: Partial<ComponentProps<typeof DeleteModal>> = {},
) => {
  const onConfirm = jest.fn();
  const onCancel = jest.fn();

  render(
    <DeleteModal
      movie={buildMovie({ title: "Heat" })}
      isOpen
      onConfirm={onConfirm}
      onCancel={onCancel}
      {...props}
    />,
  );

  return { onConfirm, onCancel };
};

describe("DeleteModal", () => {
  it("renders nothing when it is closed", () => {
    renderModal({ isOpen: false });

    expect(screen.queryByText("Delete Movie?")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders nothing when there is no movie to delete", () => {
    renderModal({ movie: null });

    expect(screen.queryByText("Delete Movie?")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("asks for confirmation and names the movie", () => {
    renderModal();

    expect(
      screen.getByRole("heading", { name: "Delete Movie?" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("This action cannot be undone."),
    ).toBeInTheDocument();
    expect(screen.getByText('"Heat"')).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Delete Movie" }),
    ).toBeInTheDocument();
  });

  it("calls onConfirm, and only onConfirm, when Delete Movie is clicked", async () => {
    const user = userEvent.setup();
    const { onConfirm, onCancel } = renderModal();

    await user.click(screen.getByRole("button", { name: "Delete Movie" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();
  });

  it("calls onCancel, and only onCancel, when Cancel is clicked", async () => {
    const user = userEvent.setup();
    const { onConfirm, onCancel } = renderModal();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("calls onCancel when the close (X) button is clicked", async () => {
    const user = userEvent.setup();
    const { onConfirm, onCancel } = renderModal();

    await user.click(screen.getByRole("button", { name: "Close modal" }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("calls onCancel when the backdrop is clicked", async () => {
    const user = userEvent.setup();
    const { onConfirm, onCancel } = renderModal();

    // The backdrop has no role or text, so we reach it through its overlay
    const overlay = document.getElementById("delete-modal-overlay");
    await user.click(overlay!.firstElementChild as HTMLElement);

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it("does not close when the dialog content itself is clicked", async () => {
    const user = userEvent.setup();
    const { onConfirm, onCancel } = renderModal();

    await user.click(screen.getByRole("heading", { name: "Delete Movie?" }));

    expect(onCancel).not.toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
