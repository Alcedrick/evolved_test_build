import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";


export default function CoachDetailsDialog({ coach, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] w-full bg-[#0f0f0f] border border-border overflow-y-auto rounded-xl p-8">
        {/* Close button */}
        <DialogHeader>
          <DialogTitle className="sr-only">Coach Profile</DialogTitle>
          <DialogClose
            className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:text-red-600"
          >
            <X className="h-5 w-5" />
          </DialogClose>
        </DialogHeader>

        {/* Profile Card */}
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Left side */}
          <div className="flex flex-col items-center md:w-1/3">
            <img
              src={coach.image}
              alt={coach.name}
              className="w-48 h-48 object-cover rounded-full border-4 border-red-600"
            />
            <h5 className="mt-4 text-xl font-semibold text-white">{coach.name}</h5>
            <p className="text-gray-300">{coach.phone}</p>
            <p className="text-gray-300">{coach.email}</p>

            {/* Social icons */}
            <div className="flex gap-4 mt-4 text-red-600">
              {coach.social?.facebook && (
                <a href={coach.social.facebook} target="_blank">
                  <i className="fa-brands fa-facebook text-2xl"></i>
                </a>
              )}
              {coach.social?.instagram && (
                <a href={coach.social.instagram} target="_blank">
                  <i className="fa-brands fa-square-instagram text-2xl"></i>
                </a>
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
              {coach.specializations.map((spec) => (
                <span
                  key={spec}
                  className="px-4 py-2 border border-red-600 text-red-600 rounded-lg text-sm font-medium"
                >
                  {spec}
                </span>
              ))}
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
              <InfoItem icon="fa-solid fa-briefcase" label="Experience" value={coach.experience} />
              <InfoItem icon="fa-solid fa-calendar-days" label="Availability" value={coach.availability} />
              <InfoItem icon="fa-solid fa-person-chalkboard" label="Programs Offered" value={coach.programsOffered} />
              <InfoItem icon="fa-solid fa-user" label="Employment Type" value={coach.employmentType} />
            </div>

            {/* Achievements */}
            <div className="flex items-start gap-3 mt-6">
              <i className="fa-solid fa-award text-2xl text-red-600"></i>
              <div>
                <p className="font-semibold text-red-500">Achievements / Recognition</p>
                {coach.achievements.map((ach, i) => (
                  <p key={i}>{ach}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* Reusable InfoItem subcomponent */
function InfoItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <i className={`${icon} text-2xl text-red-600`}></i>
      <div>
        <p className="font-semibold text-red-500">{label}</p>
        <p>{value}</p>
      </div>
    </div>
  );
}
