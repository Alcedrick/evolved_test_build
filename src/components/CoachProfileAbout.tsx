import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from "@/components/ui/carousel"
import { FaTiktok } from "react-icons/fa";
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
  BriefcaseBusiness,
  Users,
  CalendarDays,
  Trophy,
  BookOpenText,
  User,
  FileBadge,
  Clock,
  AppleIcon,
  ShieldIcon,
  Facebook,
  Instagram,
  Youtube,
  Award,
} from "lucide-react";
import { COACH_PROFILE_ABOUT } from "@/constants/index";

const CoachProfileAbout = () => {
  return (
    <div className="w-full pb-24 pt-16 relative">
      <div className="container mx-auto max-w-6xl px-4">
        {/* HEADER- PROGRAM GALLERY */}
        <div className="bg-light-black backdrop-blur-sm border border-border rounded-lg overflow-hidden mb-16">
          {/* HEADER BAR */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-background/70">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-medium-red"></div>
              <span className="text-sm text-medium-red font-medium">Program Gallery</span>
            </div>
            <div className="text-sm text-muted-foreground">Featured Plans</div>
          </div>

          {/* HEADER CONTENT */}
          <div className="p-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-foreground">AI-Generated </span>
              <span className="text-medium-red">Programs</span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
              Explore personalized fitness plans our AI assistant has created for other users
            </p>

            {/* STATS */}
            <div className="flex items-center justify-center gap-16 mt-10 font-mono">
              <div className="flex flex-col items-center">
                <p className="text-3xl text-medium-red">500+</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wide mt-1">
                  PROGRAMS
                </p>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="flex flex-col items-center">
                <p className="text-3xl text-medium-red">3min</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wide mt-1">
                  CREATION TIME
                </p>
              </div>
              <div className="w-px h-12 bg-border"></div>
              <div className="flex flex-col items-center">
                <p className="text-3xl text-medium-red">100%</p>
                <p className="text-sm text-muted-foreground uppercase tracking-wide mt-1">
                  PERSONALIZED
                </p>
              </div>
            </div>
          </div>
        </div>
        
          

        {/* Program Cards */}
        <Carousel className="w-full">
        <CarouselContent>
          {COACH_PROFILE_ABOUT.map((program) => (
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
                      <span className="text-sm text-medium-red">COACH.{program.id}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {program.availability}
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
                          <span className="text-medium-red"> {program.last_name}</span>
                        </CardTitle>
                        <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                          <Users className="h-4 w-4" />
                          Experience • {program.experience} yr/s
                        </div>
                      </div>
                    </div>
          
                    <div className="flex justify-between items-center gap-4">
                      <div className="px-3 py-1 bg-medium-red/10 rounded border border-medium-red/20 text-sm text-medium-red flex items-center gap-2">
                        <BriefcaseBusiness className="h-4 w-4" />
                        {program.employmentType}
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
                            {program.card_first_tier}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {program.card_first_subtier}
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
                            {program.card_second_tier}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {program.card_second_subtier}
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
                            {program.card_third_tier}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {program.card_third_subtier}
                          </p>
                        </div>
                      </div>
                    </div>
          
                    {/* description pinned to bottom before footer */}
                    <div className="mt-5 pt-5 border-t border-border">
                      <div className="text-sm text-muted-foreground">
                        <span className="text-medium-red">&gt; </span>
                        &quot; {program.philosophy?.substring(0, 120)}&quot;
                      </div>
                    </div>
                  </CardContent>
          
                  <CardFooter className="px-5 py-4 border-t border-border">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="w-full bg-medium-red text-medium-red-foreground hover:bg-medium-red/90">
                            View Coach Details
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                              
                        <DialogContent className="sm:max-w-5xl h-[80vh] w-full bg-black border border-border overflow-y-auto">
                        <DialogHeader>
                              <DialogTitle className="sr-only">Coach Profile</DialogTitle>
                              
                            </DialogHeader>
                              
                            {/* Profile Card */}
                            <div className="flex flex-col md:flex-row gap-10 items-start">
                              {/* Left side */}
                              <div className="flex flex-col items-center md:w-1/3">
                                <img
                                  src={program.profilePic}
                                  alt=""
                                  className="w-48 h-48 object-cover rounded-full border-4 border-red-600"
                                />
                                <h5 className="mt-4 text-xl font-semibold text-white">{program.first_name} {program.last_name}</h5>
                                <p className="text-gray-300">{program.phone}</p>
                                <p className="text-gray-300">{program.email}</p>
                                {/* Social icons */}
                                <div className="flex gap-3 pt-3">
                                  {program.social?.facebook && ( 
                                    <Link href={program.social.facebook} className="flex items-center"> <Facebook /> </Link> 
                                  )}
                                  {program.social?.instagram && ( 
                                    <Link href={program.social.instagram} className="flex items-center"> <Instagram /> </Link> 
                                  )}
                                  {program.social?.youtube && ( 
                                    <Link href={program.social.youtube} className="flex items-center"> <Youtube /> </Link> 
                                  )}
                                  {program.social?.tiktok && ( 
                                    <Link href={program.social.tiktok} className="flex items-center"> <FaTiktok /> </Link> 
                                  )}
                                </div>
                              </div>
                              
                              {/* Right side */}
                              <div className="flex-1 space-y-6">
                                {/* Header */}
                                <h3 className="text-2xl font-bold text-center text-red-600 bg-red-900/30 py-2 rounded-lg">
                                  Coach Profile
                                </h3>
                              
                                {/* Specializations */}
                                <div className="flex flex-wrap gap-3 justify-center">
                                {program.specialization?.split(",").map((spec) => ( 
                                    <span key={spec}className="px-4 py-2 border border-red-600 text-red-600 rounded-lg text-sm font-medium">
                                      {spec.trim()}
                                    </span>
                                  ))}

                                </div>
                                
                                {/* Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
                                  {/* Experience */}
                                  <div className="flex items-start gap-3">
                                    <BriefcaseBusiness />
                                    <div>
                                      <p className="font-semibold text-red-500">Experience</p>
                                      <p>• {program.experience} years</p>
                                    </div>
                                  </div>
                                
                                  {/* Availability */}
                                  <div className="flex items-start gap-3">
                                    <CalendarDays />
                                    <div>
                                      <p className="font-semibold text-red-500">Availability</p>
                                      <p>• {program.availability}</p>
                                    </div>
                                  </div>
                                
                                  {/* Programs Offered */}
                                  <div className="flex items-start gap-3">
                                    <BookOpenText />
                                    <div>
                                      <p className="font-semibold text-red-500">Programs Offered</p>
                                      <p>• {program.programsOffered}</p>
                                    </div>
                                  </div>
                                
                                  {/* Employment Type */}
                                  <div className="flex items-start gap-3">
                                    <User />
                                    <div>
                                      <p className="font-semibold text-red-500">Employment Type</p>
                                      <p>• {program.employmentType}</p>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Achievements */}
                                <div className="flex items-start gap-3 mt-6">
                                  <Trophy />
                                  <div>
                                    <p className="font-semibold text-red-500">Achievements / Recognition</p>
                                    
                                  {program.achievements?.split(",").map((ach, i) => (
                                    <p key={i} className="">• {ach.trim()}</p>
                                    ))}
                                  </div>
                                </div>

                                {/* Certificates */}
                                <div className="flex items-start gap-3 mt-6">
                                  <FileBadge />
                                  <div>
                                    <p className="font-semibold text-red-500">Certificates</p>
                                    
                                  {program.certificates?.split(",").map((ach, i) => (
                                    <p key={i} className="">• {ach.trim()}</p>
                                    ))}
                                  </div>
                                </div>
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
            Join 500+ users with AI-customized fitness programs
          </p>
        </div>
      </div>
    </div>
  );
};

export default CoachProfileAbout;