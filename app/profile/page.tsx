import { getCurrentUser } from "@/auth/currentUser";
import Header from "../components/Header";
import { Calendar, Check, Edit, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import MainButton from "../components/MainButton";

export default async function ProfilePage() {
  const currentUser = await getCurrentUser({ withFullUser: true });

//  Dummy profile data
  const profileData = {
    name: "Dr. Alex Johnson",
    email: "alex.johnson@healthclinic.com",
    location: "San Francisco, CA",
    bio: "Board-certified physician specializing in family medicine with over 10 years of experience. Dedicated to providing compassionate, comprehensive healthcare to patients of all ages.",
    specialty: "Family Medicine",
    joinDate: "January 2023",
    workingHours: [
      { day: "Monday", hours: "9:00 AM - 5:00 PM", available: true },
      { day: "Tuesday", hours: "9:00 AM - 5:00 PM", available: true },
      { day: "Wednesday", hours: "9:00 AM - 5:00 PM", available: true },
      { day: "Thursday", hours: "9:00 AM - 5:00 PM", available: true },
      { day: "Friday", hours: "9:00 AM - 3:00 PM", available: true },
      { day: "Saturday", hours: "Closed", available: false },
      { day: "Sunday", hours: "Closed", available: false },
    ],
    badges: [
      "Verified Provider",
      "Accepting New Patients",
      "Telehealth Available",
    ],
  };

  if (!currentUser) {
    return "User not found";
  }

  return (
    <div>
      <Header user={currentUser} />
      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-4xl mx-auto px-4 py-12 ">
          <div className="shadow-card overflow-hidden animate-fade-in border-2 border-slate-700/50 rounded-xl">
            <div className="h-32 bg-primary rounded-t-md" />

            {/* Profile Content */}
            <div className="px-6 pb-6 -mt-16">
              {/* Avatar */}

              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6">
                <div className="w-32 h-32 rounded-full mx-auto  border-2 border-slate-700/50 overflow-hidden shadow-soft lg:mx-0">
                  <Image
                    src={"/test_profile_picture.png"}
                    alt={profileData.name}
                    className="w-full h-full object-cover"
                    width={200}
                    height={200}
                  />
                </div>

                <MainButton variant="secondary" className="mt-4 lg:mt-20">
                  <div className="flex justify-center items-center gap-2">
                    Edit Profile
                    <Edit className="w-5 h-5" />
                  </div>
                </MainButton>
              </div>

              {/* Name and Bio */}
              <div className="space-y-4 mb-6 animate-fade-in-delay">
                <div>
                  <div className="flex flex-col justify-between items-center lg:flex-row lg:items-center">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {profileData.name}
                    </h1>
                    <p className="text-2xl text-foreground font-bold mb-2">
                      {profileData.specialty}
                    </p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {profileData.bio}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-sm font-medium text-foreground hover:bg-primary/20">
                    <Check className="mr-2 h-4 w-4" />
                    Verified Provider
                  </span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-col justify-between gap-6 mb-6 lg:flex-row">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="p-2 rounded-lg bg-muted">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <span>{profileData.email}</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="p-2 rounded-lg bg-muted">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <span>{profileData.location}</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="p-2 rounded-lg bg-muted">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <span>Since {profileData.joinDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
