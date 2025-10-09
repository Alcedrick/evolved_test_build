"use client";
import { useState, useEffect, useRef } from "react";
import {
  DumbbellIcon,
  HomeIcon,
  UserIcon,
  BookAlert,
  ShieldAlert,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { createPortal } from "react-dom";

const Navbar = () => {
  const { isSignedIn, user } = useUser();
  const role = user?.publicMetadata?.role as string | undefined;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => setIsClient(true), []);

  // Detect clicks outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // Close on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md py-3 border-b border-border">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/LIFTAPP_LOGO.png"
            alt="LiftApp Logo"
            width={100}
            height={100}
            className="w-8 h-8"
          />
          <span className="text-xl font-bold font-sans">
            <span className="text-medium-red">Lift</span>App
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-5">
          {isSignedIn ? (
            <>
              <Link href="/" className="flex items-center gap-1.5 text-sm hover:text-destructive transition-colors">
                <HomeIcon size={18} /> Home
              </Link>
              <Link href="/generate-program" className="flex items-center gap-1.5 text-sm hover:text-destructive transition-colors">
                <DumbbellIcon size={18} /> Generate
              </Link>
              <Link href="/profile" className="flex items-center gap-1.5 text-sm hover:text-destructive transition-colors">
                <UserIcon size={18} /> Profile
              </Link>
              <Link href="/about" className="flex items-center gap-1.5 text-sm hover:text-destructive transition-colors">
                <BookAlert size={18} /> About
              </Link>
              {role === "admin" && (
                <Link href="/admin" className="flex items-center gap-1.5 text-sm hover:text-destructive transition-colors">
                  <ShieldAlert size={18} /> Admin
                </Link>
              )}
              <UserButton />
            </>
          ) : (
            <Link href="/sign-in">
              <Button variant="outline" className="border-destructive text-default hover:text-white hover:bg-destructive/10">
                Sign In
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* ✅ Portal for Overlay + Sidebar */}
      {isClient &&
        createPortal(
          <>
            {/* Dim Overlay */}
            {isMenuOpen && (
              <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
                onClick={closeMenu}
              ></div>
            )}

            {/* Sidebar */}
            <div
              ref={menuRef}
              className={`fixed top-[4rem] right-0 bg-background/95 border-l border-border shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden
                ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
                w-[50%] h-[80vh] rounded-tl-2xl rounded-bl-2xl flex flex-col justify-between`}
            >
              {/* User Info */}
              {isSignedIn && (
                <div className="flex items-center gap-3 p-4 border-b border-border bg-background sticky top-0">
                  <UserButton afterSignOutUrl="/" />
                  <span className="text-sm font-medium truncate">
                    {user?.fullName || user?.username || "User"}
                  </span>
                </div>
              )}

              {/* Nav Links */}
              <div className="flex flex-col flex-grow overflow-y-auto">
                <nav className="flex flex-col p-4 gap-3">
                  {isSignedIn ? (
                    <>
                      <Link
                        href="/"
                        onClick={closeMenu}
                        className="flex items-center gap-3 text-base hover:text-destructive transition-colors py-3"
                      >
                        <HomeIcon size={20} /> Home
                      </Link>
                      <Link
                        href="/generate-program"
                        onClick={closeMenu}
                        className="flex items-center gap-3 text-base hover:text-destructive transition-colors py-3"
                      >
                        <DumbbellIcon size={20} /> Generate
                      </Link>
                      <Link
                        href="/profile"
                        onClick={closeMenu}
                        className="flex items-center gap-3 text-base hover:text-destructive transition-colors py-3"
                      >
                        <UserIcon size={20} /> Profile
                      </Link>
                      <Link
                        href="/about"
                        onClick={closeMenu}
                        className="flex items-center gap-3 text-base hover:text-destructive transition-colors py-3"
                      >
                        <BookAlert size={20} /> About
                      </Link>
                      {role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={closeMenu}
                          className="flex items-center gap-3 text-base hover:text-destructive transition-colors py-3"
                        >
                          <ShieldAlert size={20} /> Admin
                        </Link>
                      )}
                    </>
                  ) : (
                    <Link href="/sign-in" onClick={closeMenu}>
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-destructive text-default hover:text-white hover:bg-destructive/10 w-full mt-2"
                      >
                        Sign In
                      </Button>
                    </Link>
                  )}
                </nav>
              </div>

              {/* ✅ Bottom Footer */}
              <footer className="p-4 border-t border-border flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <Image
                    src="/LIFTAPP_LOGO.png"
                    alt="LiftApp Logo"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                  <span className="font-semibold text-sm">
                    <span className="text-medium-red">Lift</span>App
                  </span>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  © {new Date().getFullYear()} LiftApp — All rights reserved
                </p>
              </footer>
            </div>
          </>,
          document.body
        )}
    </header>
  );
};

export default Navbar;
