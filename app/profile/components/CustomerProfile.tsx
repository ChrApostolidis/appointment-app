import Header from "@/app/components/Header";
import { Edit, Calendar, Mail, MapPin } from "lucide-react";
import MainButton from "@/app/components/MainButton";
import { notFound } from "next/navigation";

type CustomerProfileProps = {
  customer: {
    name: string;
    email: string;
    interests: string | null;
    createdAt: Date;
  }
};

export default function CustomerProfile({ customer }: CustomerProfileProps) {
  if (!customer) return notFound();

  return (
    <>
      <Header user={customer} />
      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-4xl mx-auto px-4 py-12">
          <div className="shadow-card overflow-hidden animate-fade-in border-2 border-slate-700/50 rounded-xl">
            {/* Banner */}
            <div className="h-32 bg-primary rounded-t-md" />

            {/* Profile Content */}
            <div className="px-6 pb-6 -mt-16">
              {/* Avatar + Edit Button */}
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-6">
                {/* Avatar */}
                <div className="w-32 h-32 rounded-full mx-auto border-2 border-slate-700/50 overflow-hidden shadow-soft lg:mx-0 flex items-center justify-center bg-muted">
                  <span className="text-4xl font-semibold text-muted-foreground">
                    {customer.name
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>

                <MainButton className="mt-4 lg:mt-20 hover:bg-indigo-700">
                  <div className="flex justify-center items-center gap-2">
                    Edit Profile
                    <Edit className="w-5 h-5" />
                  </div>
                </MainButton>
              </div>
              {/* Name and Bio */}
              <div className="space-y-4 mb-6 animate-fade-in-delay">
                <div>
                  <div className="flex flex-col justify-between items-center lg:flex-row">
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                      {customer.name ?? "Customer Name"}
                    </h1>
                  </div>
                </div>
              </div>{" "}
              {/* Contact Info */}
              <div className="flex flex-col justify-between gap-6 mb-6 border border-border rounded-2xl shadow-lg p-8 lg:flex-row">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="p-2 rounded-lg bg-muted">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <span>{customer.email ?? "Customer Email"}</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="p-2 rounded-lg bg-muted">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <span>Thessaloniki</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="p-2 rounded-lg bg-muted">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <span>
                    Since {new Date(customer.createdAt).getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
