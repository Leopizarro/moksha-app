import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AppHeader from "../AppHeader";
import { useSession } from "next-auth/react";
import { describe } from "node:test";
import { useRouter } from "next/router";
import userEvent from "@testing-library/user-event";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
}));

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("App header", () => {
  describe("Render", () => {
    it("Render app title if user is authenticated", () => {
      useSession.mockReturnValue({
        data: { user: { name: "John Doe" } },
        status: "authenticated",
      });
      render(<AppHeader />);
      const appHeaderTitle = screen.getByText("Deco Moksha");
      expect(appHeaderTitle).toBeInTheDocument();
    });
    it("Render app title if user is unauthenticated", () => {
      useSession.mockReturnValue({
        data: { user: { name: "John Doe" } },
        status: "authenticated",
      });
      render(<AppHeader />);
      const appHeaderTitle = screen.getByText("Deco Moksha");
      expect(appHeaderTitle).toBeInTheDocument();
    });
    it("Render logout button if user is authenticated", () => {
      useSession.mockReturnValue({
        data: { user: { name: "John Doe" } },
        status: "authenticated",
      });
      render(<AppHeader />);
      const logoutButton = screen.getByText("Log out");
      expect(logoutButton).toBeInTheDocument();
    });
    it("Hide logout button if user is authenticated", () => {
      useSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
      });
      render(<AppHeader />);
      const logoutButton = screen.queryByText("Log out");
      expect(logoutButton).not.toBeInTheDocument();
    });
  });
  describe("Behaviour", () => {
    it("Photography button redirects to photography gallery when clicked", () => {
      const push = jest.fn();
      useRouter.mockReturnValue({ push });

      render(<AppHeader />);

      const photographyGalleryLink = screen.getByTestId("about-redirect-link");
      expect(photographyGalleryLink).toBeInTheDocument();
      userEvent.click(photographyGalleryLink);
      expect(photographyGalleryLink.getAttribute("href")).toBe("/about");
    });

    it("Photography button redirects to paintings gallery when clicked", () => {
      const push = jest.fn();
      useRouter.mockReturnValue({ push });

      render(<AppHeader />);

      const photographyGalleryLink = screen.getByTestId(
        "custom-projects-redirect-link"
      );
      expect(photographyGalleryLink).toBeInTheDocument();
      userEvent.click(photographyGalleryLink);
      expect(photographyGalleryLink.getAttribute("href")).toBe(
        "/custom-projects"
      );
    });
  });
});
