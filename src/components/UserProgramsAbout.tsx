import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ChevronRight,
  Dumbbell,
  Sparkles,
  Users,
  Clock,
  AppleIcon,
  ShieldIcon,
} from "lucide-react";
import { USER_PROGRAMS_ABOUT } from "@/constants";

const UserProgramsAbout = () => {
  return (
    <div className="w-full pb-24 pt-16 relative">
      <div className="container mx-auto max-w-6xl px-4">
        {/* HEADER- PROGRAM GALLERY */}
        <div className="bg-light-black backdrop-blur-sm border border-border rounded-lg overflow-hidden mb-16">
          {/* HEADER BAR */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-background/70">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-medium-red"></div>
              <span className="text-sm text-medium-red font-medium">Evolved Fitness Center</span>
            </div>
          </div>

          {/* HEADER CONTENT */}
          <div className="p-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-medium-red">About Us</span>
            </h2>

            <p className="text-m  mx-auto mb-10 text-justify indent-10 leading-loose">
              We opened our second branch on December 2, 2022, with a simple dream, to create more than just a gym, but a place people can truly call their second home. 
              For us, fitness isn’t only about workouts or machines, it’s about helping each person become the best version of themselves, both inside and out. What makes our gym special is the people. 
              Our staff and coaches are approachable, friendly, and always ready to listen, guide, and cheer you on. Over time, we’ve built a good community where members support one another, celebrate wins together, and push through challenges side by side. 
              We also believe in never standing still. Just like our members strive to grow stronger each day, we’re committed to the continuous improvement of our gym by upgrading equipment and making sure our space is always welcoming and inspiring. 
              This is a place for people who take their fitness and quality of life seriously but also value encouragement, connection, and balance. Here, you’ll find not only a gym but also a community that grows with you every step of the way.
            </p>

            {/* STATS */}
            <div className="flex items-center justify-center gap-16 mt-10 font-mono">
              <div className="flex flex-col items-center">
                <p className="text-3xl text-medium-red font-bold">700+</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wide mt-1">
                  Members
                </p>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="flex flex-col items-center">
                <p className="text-3xl text-medium-red font-bold">21</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wide mt-1">
                  Operating Hours
                </p>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="flex flex-col items-center">
                <p className="text-3xl text-medium-red font-bold">3</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wide mt-1">
                  Years Strong
                </p>
              </div>
            </div>
          </div>
        </div>
        
          

        {/* Program Cards */}
        <Carousel className="w-full">
        <CarouselContent>
          {USER_PROGRAMS_ABOUT.map((program) => (
            <CarouselItem
              key={program.id}
              className="pl-4 md:basis-1/2 lg:basis-1/3"
            >
              <div className="h-full flex">
                <Card className="h-full flex flex-col bg-light-black backdrop-blur-sm border border-border hover:border-medium-red/50 transition-colors overflow-hidden">
                  {/* Card header */}
                  <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/70">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-medium-red"></div>
                      <span className="text-sm text-medium-red">USER.{program.id}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {program.fitness_level.toUpperCase()}
                    </div>
                  </div>
          
                  <CardHeader className="pt-6 px-5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="h-16 w-16 rounded-full overflow-hidden border border-border">
                        <img
                          src={program.profilePic}
                          alt={`${program.first_name}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-foreground">
                          {program.first_name}
                          <span className="text-medium-red">.exe</span>
                        </CardTitle>
                        <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <Users className="h-4 w-4" />
                          {program.age}y • {program.workout_days}d/week
                        </div>
                      </div>
                    </div>
          
                    <div className="flex justify-between items-center gap-4">
                      <div className="px-3 py-1 bg-medium-red/10 rounded border border-medium-red/20 text-sm text-medium-red flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        {program.fitness_goal}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        v3.5
                      </div>
                    </div>
                  </CardHeader>
          
                  {/* Make content expand */}
                  <CardContent className="px-5 flex-1 flex flex-col">
                    <div className="space-y-5 pt-2 flex-1">
                      {/* workout plan */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-medium-red/10 text-medium-red mt-0.5">
                          <Dumbbell className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">
                            {program.workout_plan.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {program.equipment_access}
                          </p>
                        </div>
                      </div>
          
                      {/* diet plan */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-medium-red/10 text-medium-red mt-0.5">
                          <AppleIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">
                            {program.diet_plan.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            System optimized nutrition
                          </p>
                        </div>
                      </div>
          
                      {/* safety */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-medium-red/10 text-medium-red mt-0.5">
                          <ShieldIcon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">
                            AI Safety Protocols
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Protection systems enabled
                          </p>
                        </div>
                      </div>
                    </div>
          
                    {/* description pinned to bottom before footer */}
                    <div className="mt-5 pt-5 border-t border-border">
                      <div className="text-sm text-muted-foreground">
                        <span className="text-medium-red">&gt; </span>
                        {program.workout_plan.description.substring(0, 120)}...
                      </div>
                    </div>
                  </CardContent>
          
                  <CardFooter className="px-5 py-4 border-t border-border">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full bg-medium-red text-medium-red-foreground hover:bg-medium-red/90">
                            View Program Details
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                              
                        <DialogContent className="sm:max-w-5xl h-[80vh] w-full bg-light-black border border-border overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl text-foreground">
                              {program.first_name}
                              <span className="text-medium-red">.exe</span>
                              
                            </DialogTitle>
                            <DialogDescription>
                              Personalized program details
                            </DialogDescription>
                            
                          </DialogHeader>
                            
                        <div className="space-y-6">
                          {/* Workout Plan */}
                          <div>
                            <h3 className="font-semibold text-medium-red mb-2">
                              {program.workout_plan.title}
                            </h3>
                            <p className="text-muted-foreground">
                              {program.workout_plan.description}
                            </p>
                          </div>
                            
                          {/* Diet Plan */}
                          <div>
                            <h3 className="font-semibold text-medium-red mb-2">
                              {program.diet_plan.title}
                            </h3>
                            <p className="text-muted-foreground">
                              Optimized nutrition & daily calories: 
                            </p>
                          </div>
                            
                          {/* Metadata */}
                          <div className="text-sm text-muted-foreground">
                            Fitness Level: {program.fitness_level} <br />
                            Age: {program.age} • {program.workout_days}d/week
                          </div>
                        </div>
                      </DialogContent>  
                    </Dialog>
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>


        {/* CTA section */}
        <div className="mt-16 text-center">
          <Link href="/generate-program">
            <Button
              size="lg"
              className="bg-medium-red text-medium-red-foreground hover:bg-medium-red/90 px-8 py-6 text-lg"
            >
              Generate Your Program
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-muted-foreground mt-4">
            Gnerate your workout with AI-customized fitness programs
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProgramsAbout;