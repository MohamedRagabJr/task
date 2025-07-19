"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
const Nav_links = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/ProductList", label: "Product List" },
    { href: "/Cart", label: "Cart" },
  ];

  return (
    <nav className="bg-gray-800 p-4 flex justify-center items-center">
      {/* Mobile menu button */}
      <div className="md:hidden flex justify-end">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white focus:outline-none"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Desktop menu */}
      <ul
        className={`${
          isOpen ? "block" : "hidden"
        } md:flex space-x-6 md:space-y-0 space-y-4`}
      >
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`text-white hover:text-blue-300 transition-colors block ${
                pathname === link.href
                  ? "font-bold border-b-2 border-blue-500"
                  : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li>
        </li>
      </ul>
    </nav>
  );
};

export default Nav_links;
