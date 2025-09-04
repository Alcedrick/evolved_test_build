"use client"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { DumbbellIcon, HomeIcon, UserIcon, Dumbbell, BookAlert, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
    const { isSignedIn, user } = useUser()
    const role = user?.publicMetadata?.role as string | undefined;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b border-border py-3">
            <div className="container mx-auto flex items-center justify-between">  
                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="p-1 bg-primary/10 rounded">
                      <Dumbbell className="w-4 h-4 text-default" />
                    </div>
                    <span className="text-xl font-bold font-sans">
                      <span className="text-destructive">Lift</span>App
                    </span>
                </Link>

                {/* NAVIGATION */}
                <nav className="flex items-center gap-5">
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
            </div>
        </header>
    );
};
export default Navbar;
