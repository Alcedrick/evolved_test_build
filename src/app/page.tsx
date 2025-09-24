import { Button } from "@/components/ui/button";
import CoachProfile from "@/components/CoachProfile";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden bg">
      <section className="relative z-10 py-16 sm:py-24 flex-grow">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/gradienta.jpg"
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 h-full flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-center w-full max-w-3xl space-y-8">
            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight flex flex-col sm:flex-row items-center sm:items-baseline justify-center gap-y-2 sm:gap-x-2">
              <span className="text-foreground whitespace-nowrap">Transform Your</span>
              <span className="scroll-window w-full sm:w-auto flex justify-center sm:inline-flex">
                <ul className="scroll-list">
                  <li className="text-medium-red">Body.</li>
                  <li className="text-medium-red">Mind.</li>
                  <li className="text-medium-red">Soul.</li>
                  <li className="text-medium-red">Lifestyle.</li>
                </ul>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl">
              Talk to our AI assistant and get personalized diet plans and workout routines
              designed just for you
            </p>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 py-6 font-mono">
              <div className="flex flex-col items-center">
                <div className="text-xl sm:text-2xl text-medium-red">500+</div>
                <div className="text-xs uppercase tracking-wider">Active Users</div>
              </div>
              <div className="hidden sm:block h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
              <div className="flex flex-col items-center">
                <div className="text-xl sm:text-2xl text-medium-red">3min</div>
                <div className="text-xs uppercase tracking-wider">Generation</div>
              </div>
              <div className="hidden sm:block h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
              <div className="flex flex-col items-center">
                <div className="text-xl sm:text-2xl text-medium-red">100%</div>
                <div className="text-xs uppercase tracking-wider">Personalized</div>
              </div>
            </div>

            {/* Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 sm:pt-6 w-full sm:w-auto justify-center">
              <Button
                size="lg"
                asChild
                className="overflow-hidden bg-red text-dark-red-foreground px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-medium"
              >
                <Link href="/generate-program" className="flex items-center font-mono">
                  Build Your Program
                  <ArrowRightIcon className="ml-2 size-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CoachProfile />
    </div>
  );
};

export default HomePage;
