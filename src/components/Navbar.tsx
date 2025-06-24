"use client"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { DumbbellIcon, HomeIcon, UserIcon, Dumbbell } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
    const {isSignedIn} = useUser()

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-md border-b border-border py-3">
            <div className="container mx-auto flex items-center justify-between">  
                {/* LOGO */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="p-1 bg-primary/10 rounded">
                      <Dumbbell className="w-4 h-4 text-default" />
                    </div>
                    <span className="text-xl font-bold font-mono">
                      Evolved <span className="text-destructive">Fitness</span>
                    </span>
                </Link>

                {/* NAVIGATION */}
                <nav className="flex items-center gap-5">
                  {isSignedIn ? (
                    <>
                      <Link
                        href="/"
                        className="flex items-center gap-1.5 text-sm hover:text-destructive transition-colors"
                      >
                        <HomeIcon size={16} />
                        <span>Home</span>
                      </Link>
                   
                      <Link
                        href="/generate-program"
                        className="flex items-center gap-1.5 text-sm hover:text-destructive transition-colors"
                      >
                        <DumbbellIcon size={16} />
                        <span>Generate</span>
                      </Link>
                   
                      <Link
                        href="/profile"
                        className="flex items-center gap-1.5 text-sm hover:text-destructive transition-colors"
                      >
                        <UserIcon size={16} />
                        <span>Profile</span>
                      </Link>
                      <Button
                        asChild
                        variant="outline"
                        className="ml-2 border-destructive/50 text-destructive hover:text-white hover:bg-destructive/10"
                      >
                        <Link href="/generate-program">Get Started</Link>
                      </Button>
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