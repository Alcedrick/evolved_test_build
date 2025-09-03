
import { Button } from "@/components/ui/button";
import UserPrograms from "@/components/UserPrograms";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const HomePage = () => {
  return (
          <div className="flex flex-col min-h-screen text-foreground overflow-hidden bg">
            <section className="relative z-10 py-24 flex-grow">
              <div className="absolute inset-0">
                <img 
                  src='/gradienta.jpg' 
                  alt="Background"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
              
              <div className="container mx-auto px-4 relative z-10 h-full flex items-center justify-center">
              <div className="flex flex-col items-center justify-center text-center w-full max-w-3xl space-y-8">
                <h1 className="text-4xl sm:text-1xl md:text-6xl lg:text-7xl font-bold tracking-tight flex flex-col sm:flex-row items-center sm:items-baseline justify-center gap-y-2 sm:gap-x-2 text-center ml-15">
                  <span className="text-foreground whitespace-nowrap">Transform Your</span>
                  <span className="scroll-window scroll-window w-full sm:w-auto flex justify-center sm:inline-flex">
                    <ul className="scroll-list">
                      <li className="text-medium-red">Body.</li>
                      <li className="text-medium-red">Mind.</li>
                      <li className="text-medium-red">Soul.</li>
                      <li className="text-medium-red">Lifestyle.</li>
                    </ul>
                  </span>
                </h1>

              <p className="text-xl text-muted-foreground max-w-2xl">
              Talk to our AI assistant and get personalized diet plans and workout routines
              designed just for you
              </p>

              {/* STATS */}
              <div className="flex items-center justify-center gap-10 py-6 font-mono">
                <div className="flex flex-col items-center">
                  <div className="text-2xl text-red">500+</div>
                  <div className="text-xs uppercase tracking-wider">ACTIVE USERS</div>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl text-red">3min</div>
                  <div className="text-xs uppercase tracking-wider">GENERATION</div>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
                <div className="flex flex-col items-center">
                  <div className="text-2xl text-red">100%</div>
                  <div className="text-xs uppercase tracking-wider">PERSONALIZED</div>
                </div>
              </div>

              {/* BUTTON */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  size="lg"
                  asChild
                  className="overflow-hidden bg-red text-dark-red-foreground px-8 py-6 text-lg font-medium"
                >
                  <Link href={"/generate-program"} className="flex items-center font-mono">
                    Build Your Program
                    <ArrowRightIcon className="ml-2 size-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      <UserPrograms />
    </div>
  );
};
export default HomePage;