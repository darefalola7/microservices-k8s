import React from "react";
import Link from "next/link";

type Props = {
  currentUser: {
    id: string;
    email: string;
  };
};

const Header: React.FC<Props> = ({ currentUser }: Props) => {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
    currentUser && { label: "Sell Tickets", href: "/tickets/new" },
    currentUser && { label: "My Orders", href: "/orders" },
    { label: "Test", href: "/test" },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li className="nav-item" key={href}>
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });
  return (
    <div>
      <nav className="navbar navbar-light bg-light">
        <Link href={"/"}>
          <a className="navbar-brand">GitTix</a>
        </Link>
        <div className="d-flex-justify-content-end">
          <ul className="nav d-flex align-item-center">{links}</ul>
        </div>
      </nav>
    </div>
  );
};

export default Header;
