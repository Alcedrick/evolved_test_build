"use client"
import { useState } from "react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { DumbbellIcon, HomeIcon, UserIcon, BookAlert, ShieldAlert, Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";

const Navbar = () => {
    const { isSignedIn, user } = useUser()
    const role = user?.publicMetadata?.role as string | undefined;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return(
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b border-border py-3">
            <div className="container mx-auto flex items-center justify-between px-4">
                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="p-1 rounded">
                      <Image src="/LIFTAPP_LOGO.png" alt="LiftApp Logo" width={100} height={100} className="w-8 h-8" />
                    </div>
                    <span className="text-xl font-bold font-sans">
                      <span className="text-destructive">Lift</span>App
                    </span>
                </Link>

                {/* DESKTOP NAVIGATION */}
                <nav className="hidden md:flex items-center gap-5">
                  {isSignedIn ? (
                    <>
                      <Link href="/" className="flex items-center gap-1.5 text-sm hover:text-destructive transition-colors">
                        <HomeIcon size={18} />
                        <span>Home</span>
                      </Link>

                      <Link href="/generate-program" className="flex items-center gap-1.5 text-sm hover:text-destructive transition-colors">
                        <DumbbellIcon size={18} />
                        <span>Generate</span>
                      </Link>

                      <Link href="/profile" className="flex items-center gap-1.5 text-sm hover:text-destructive transition-colors">
                        <UserIcon size={18} />
                        <span>Profile</span>
                      </Link>

                      <Link href="/about" className="flex items-center gap-1.5 text-sm hover:text-destructive transition-colors">
                        <BookAlert size={18} />
                        <span>About</span>
                      </Link>

                      {/* Show only if admin */}
                      {role === "admin" && (
                        <Link href="/admin" className="flex items-center gap-1.5 text-sm hover:text-destructive transition-colors">
                          <ShieldAlert size={18} />
                          <span>Admin</span>
                        </Link>
                      )}

                      <UserButton />
                    </>
                  ) : (
                    <>
                      <SignInButton>
                        <Button
                          variant={"outline"}
                          className="border-destructive text-default hover:text-white hover:bg-destructive/10"
                        >
                          Sign In
                        </Button>
                      </SignInButton>

                      <SignUpButton>
                        <Button className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Sign Up
                        </Button>
                      </SignUpButton>
                    </>
                  )}
                </nav>

                {/* MOBILE HAMBURGER BUTTON */}
                <button
                  onClick={toggleMenu}
                  className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
                  aria-label="Toggle menu"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* MOBILE MENU */}
            {isMenuOpen && (
              <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border">
                <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
                  {isSignedIn ? (
                    <>
                      <Link
                        href="/"
                        className="flex items-center gap-2 text-sm hover:text-destructive transition-colors py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <HomeIcon size={18} />
                        <span>Home</span>
                      </Link>

                      <Link
                        href="/generate-program"
                        className="flex items-center gap-2 text-sm hover:text-destructive transition-colors py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <DumbbellIcon size={18} />
                        <span>Generate</span>
                      </Link>

                      <Link
                        href="/profile"
                        className="flex items-center gap-2 text-sm hover:text-destructive transition-colors py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <UserIcon size={18} />
                        <span>Profile</span>
                      </Link>

                      <Link
                        href="/about"
                        className="flex items-center gap-2 text-sm hover:text-destructive transition-colors py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <BookAlert size={18} />
                        <span>About</span>
                      </Link>

                      {/* Show only if admin */}
                      {role === "admin" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 text-sm hover:text-destructive transition-colors py-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <ShieldAlert size={18} />
                          <span>Admin</span>
                        </Link>
                      )}

                      <div className="pt-2 border-t border-border">
                        <UserButton />
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-3 pt-2">
                      <SignInButton>
                        <Button
                          variant={"outline"}
                          className="w-full border-destructive text-default hover:text-white hover:bg-destructive/10"
                        >
                          Sign In
                        </Button>
                      </SignInButton>

                      <SignUpButton>
                        <Button className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Sign Up
                        </Button>
                      </SignUpButton>
                    </div>
                  )}
                </nav>
              </div>
            )}
        </header>
    );
};

export default Navbar;
