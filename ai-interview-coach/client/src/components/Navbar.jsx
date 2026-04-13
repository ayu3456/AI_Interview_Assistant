import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  const navLink = (to, label) => (
    <Link
      to={to}
      onClick={() => setMenuOpen(false)}
      className={`text-sm font-medium transition-colors duration-200 ${
        pathname === to ? "text-white" : "text-textSecondary hover:text-white"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <RocketLaunchIcon className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-extrabold tracking-tight text-white sm:text-base">
            AI Interview Coach
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 sm:flex">
          {user ? (
            <>
              {navLink("/dashboard", "Dashboard")}
              {navLink("/setup", "New Interview")}
              <div className="h-4 w-px bg-white/10" />
              <span className="text-sm text-textSecondary">
                Hi, <span className="font-semibold text-white">{user.name?.split(" ")[0]}</span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-white transition-all duration-200 hover:border-error/40 hover:bg-error/10 hover:text-error"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              {navLink("/login", "Sign In")}
              <Link
                to="/signup"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:opacity-90"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex items-center justify-center rounded-lg border border-white/10 p-2 text-textSecondary sm:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-surface/95 px-4 py-4 sm:hidden">
          <div className="flex flex-col gap-4">
            {user ? (
              <>
                <span className="text-sm text-textSecondary">
                  Signed in as <span className="font-semibold text-white">{user.name}</span>
                </span>
                {navLink("/dashboard", "Dashboard")}
                {navLink("/setup", "New Interview")}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-full border border-error/30 bg-error/10 py-2 text-sm font-semibold text-error"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                {navLink("/login", "Sign In")}
                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full bg-primary py-2.5 text-center text-sm font-semibold text-white"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
