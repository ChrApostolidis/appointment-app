"use client";

import { useState, useTransition } from "react";

import Header from "@/app/components/Header";
import { Edit, Calendar, Mail, MapPin } from "lucide-react";
import MainButton from "@/app/components/MainButton";
import { notFound } from "next/navigation";
import { userType } from "@/app/registerForms/components/LockedRegisterForm";
import Modal from "./Modal";
import { updateCustomerProfile } from "../actions/profileActions";

type CustomerProfileProps = {
  customer: {
    name: string;
    email: string;
    interests: string | null;
    createdAt: Date;
  };
  currentUser: userType;
};

export default function CustomerProfile({
  customer,
  currentUser,
}: CustomerProfileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<
    "cancel" | "confirm" | null
  >(null);
  const [isPending, startTransition] = useTransition();

  if (!customer) return notFound();
  if (!currentUser) return notFound();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPendingAction("confirm");
    const formData = new FormData(e.currentTarget);
    const rawName = (formData.get("name") as string).trim();
    const rawEmail = (formData.get("email") as string).trim();
    const userId = currentUser?.id;

    if (!userId) {
      setError("You must be logged in to update your profile");
      return;
    }

    const name = rawName || customer.name;
    const email = rawEmail || customer.email;

    if (name === customer.name && email === customer.email) {
      setError("No changes made");
      return;
    }

    startTransition(() => {
      updateCustomerProfile({
        name,
        email,
        userId,
      }).then((res) => {
        if (res?.error) {
          setError(res.error);
        } else {
          setIsOpen(false);
          setError(null);
        }
      });
    });
  };

  return (
    <>
      <Header user={currentUser} />
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

                <MainButton
                  onClick={() => {
                    setIsOpen(true);
                    setError(null);
                  }}
                  className="mt-4 lg:mt-20 hover:bg-indigo-700"
                >
                  <div className="flex justify-center items-center gap-2">
                    Edit Profile
                    <Edit className="w-5 h-5" />
                  </div>
                </MainButton>
                {isOpen && (
                  <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    <div className="rounded-xl bg-background p-6 shadow-xl">
                      <h3 className="mb-6 text-center text-xl font-semibold text-foreground lg:text-2xl">
                        Edit Customer Profile
                      </h3>
                      {error && (
                        <div className="text-center mb-4 rounded-lg bg-red-100 p-4 text-red-700">
                          {error}
                        </div>
                      )}

                      <form className="space-y-4" onSubmit={onSubmit}>
                        <div className="flex flex-col gap-1">
                          <label
                            htmlFor="name"
                            className="text-sm font-medium text-foreground"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            placeholder={customer.name}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-foreground 
                     focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label
                            htmlFor="email"
                            className="text-sm font-medium text-foreground"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            placeholder={customer.email}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-foreground
                     focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>

                        {/* Actions */}
                        <div className="mt-6 lg:flex lg:justify-end lg:gap-2 ">
                          <MainButton
                            disabled={isPending}
                            type="button"
                            onClick={() => {
                              setIsOpen(false);
                              setError(null);
                              setPendingAction("cancel");
                            }}
                            variant="danger"
                            className="mb-2 w-full lg:w-auto lg:mb-0"
                          >
                            {isPending && pendingAction === "cancel"
                              ? "Closing..."
                              : "Cancel"}
                          </MainButton>

                          <MainButton
                            disabled={isPending}
                            type="submit"
                            className="w-full lg:w-auto"
                          >
                            {isPending && pendingAction === "confirm"
                              ? "Updating..."
                              : "Update Changes"}
                          </MainButton>
                        </div>
                      </form>
                    </div>
                  </Modal>
                )}
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
