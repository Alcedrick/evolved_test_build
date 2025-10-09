"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import ProfileHeader from "@/components/ProfileHeader";
import NoFitnessPlan from "@/components/NoFitnessPlan";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppleIcon, CalendarIcon, DumbbellIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { QRCodeSVG } from "qrcode.react";

const ProfilePage = () => {
  const { user, isLoaded } = useUser();

  const allPlans = useQuery(
    api.plans.getUserPlans,
    user ? { userId: user.id } : "skip"
  );
  const [selectedPlanId, setSelectedPlanId] = useState<null | string>(null);

  if (!isLoaded) return <div className="text-gray-300">Loading...</div>;

  const activePlan = allPlans?.find((plan) => plan.isActive);
  const currentPlan = selectedPlanId
    ? allPlans?.find((plan) => plan._id === selectedPlanId)
    : activePlan;

  return (
    <section className="relative z-10 pt-12 pb-32 flex-grow container mx-auto px-4 text-gray-100">
      <ProfileHeader user={user} />

      {/* QR CODE */}
      <div className="relative rounded-xl p-6 mb-6 shadow-lg flex flex-col items-center text-center">
        <h2 className="text-xl font-bold mb-4">
          <span className="text-gray-100">Your</span>{" "}
          <span className="text-red-500">QR Code</span>
        </h2>

        {user && (
          <div className="flex flex-col items-center gap-4">
            <QRCodeSVG value={user.id} size={180} level="H" includeMargin />
            <p className="text-sm text-neutral-400 font-mono">
              Show this QR at the gym entrance
            </p>
          </div>
        )}
      </div>

      {allPlans && allPlans.length > 0 ? (
        <div className="space-y-8">
          {/* PLAN SELECTOR */}
          <div className="relative bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg">
            
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                <span className="text-red-500">Your</span>{" "}
                <span className="text-gray-100">Fitness Plans</span>
              </h2>
              <div className="font-mono text-xs text-neutral-400">
                TOTAL: {allPlans.length}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {allPlans.map((plan) => (
                <Button
                  key={plan._id}
                  onClick={() => setSelectedPlanId(plan._id)}
                  className={`bg-neutral-950 text-neutral-50 font-mono transition-colors 
                    ${
                      selectedPlanId === plan._id
                        ? "bg-red-600/20 text-red-400 border-neutral-800"
                        : "hover:bg-neutral-800 hover:text-white"
                    }`}
                >
                  {plan.name}
                  {plan.isActive && (
                    <span className="ml-2 bg-green-600/20 text-green-400 text-xs px-2 py-0.5 rounded">
                      ACTIVE
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* PLAN DETAILS */}
          {currentPlan && (
            <div className="relative bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-lg">


              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <h3 className="text-lg font-bold">
                  PLAN: <span className="text-red-500">{currentPlan.name}</span>
                </h3>
              </div>

              <Tabs defaultValue="workout" className="w-full">
                <TabsList className="mb-6 w-full grid grid-cols-2 bg-neutral-950 border border-neutral-800 rounded-lg">
                  <TabsTrigger
                    value="workout"
                    className="data-[state=active]:bg-red-600/20 data-[state=active]:text-red-400 hover:bg-neutral-800"
                  >
                    <DumbbellIcon className="mr-2 size-4" />
                    Workout Plan
                  </TabsTrigger>
                  <TabsTrigger
                    value="diet"
                    className="data-[state=active]:bg-red-600/20 data-[state=active]:text-red-400 hover:bg-neutral-800"
                  >
                    <AppleIcon className="mr-2 h-4 w-4" />
                    Diet Plan
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="workout">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <CalendarIcon className="h-4 w-4 text-red-500" />
                      <span className="font-mono text-sm text-neutral-200">
                        SCHEDULE: {currentPlan.workoutPlan.schedule.join(", ")}
                      </span>
                    </div>

                    <Accordion type="multiple" className="space-y-4">
                      {currentPlan.workoutPlan.exercises.map(
                        (exerciseDay, index) => (
                          <AccordionItem
                            key={index}
                            value={exerciseDay.day}
                            className="border border-neutral-800 rounded-lg bg-neutral-950 overflow-hidden"
                          >
                            <AccordionTrigger className="px-4 py-3 hover:bg-neutral-950 font-mono text-gray-100">
                              <div className="flex justify-between w-full items-center">
                                <span className="text-red-500">
                                  {exerciseDay.day}
                                </span>
                                <div className="text-xs text-neutral-100">
                                  {exerciseDay.routines.length} EXERCISES
                                </div>
                              </div>
                            </AccordionTrigger>

                            <AccordionContent className="pb-4 px-4">
                              <div className="space-y-3 mt-2">
                                {exerciseDay.routines.map(
                                  (routine, routineIndex) => (
                                    <div
                                      key={routineIndex}
                                      className="border border-neutral-800 rounded p-3 bg-neutral-950/80"
                                    >
                                      <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-gray-100">
                                          {routine.name}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                          <div className="px-2 py-1 rounded bg-red-600/20 text-red-400 text-xs font-mono">
                                            {routine.sets} SETS
                                          </div>
                                          <div className="px-2 py-1 rounded bg-neutral-800 text-gray-300 text-xs font-mono">
                                            {routine.reps} REPS
                                          </div>
                                        </div>
                                      </div>
                                      {routine.description && (
                                        <p className="text-sm text-neutral-400 mt-1">
                                          {routine.description}
                                        </p>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )
                      )}
                    </Accordion>
                  </div>
                </TabsContent>

                <TabsContent value="diet">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-mono text-sm text-neutral-50">
                        DAILY CALORIE TARGET
                      </span>
                      <div className="font-mono text-xl text-red-500">
                        {currentPlan.dietPlan.dailyCalories} KCAL
                      </div>
                    </div>

                    <div className="h-px w-full bg-neutral-600 my-4"></div>

                    <div className="space-y-4">
                      {currentPlan.dietPlan.meals.map((meal, index) => (
                        <div
                          key={index}
                          className="border border-neutral-800 rounded-lg p-4 bg-neutral-950"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <h4 className="font-mono text-red-500">
                              {meal.name}
                            </h4>
                          </div>
                          <ul className="space-y-2">
                            {meal.foods.map((food, foodIndex) => (
                              <li
                                key={foodIndex}
                                className="flex items-center gap-2 text-sm text-neutral-200"
                              >
                                <span className="text-xs text-red-400 font-mono">
                                  {String(foodIndex + 1).padStart(2, "0")}
                                </span>
                                {food}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      ) : (
        <NoFitnessPlan />
      )}
    </section>
  );
};

export default ProfilePage;
