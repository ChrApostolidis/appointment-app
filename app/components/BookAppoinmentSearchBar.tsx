"use client";

import { categories } from "../registerForms/data";
import MainButton from "./MainButton";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { userType } from "../registerForms/components/LockedRegisterForm";
import { getProvidersByCategory } from "../book/actions/actions";

type ProviderOption = { userId: string; businessName: string };

export default function BookAppointmentSearchBar({
  user,
  initialCategory,
  initialDate,
}: {
  user: userType | null;
  initialCategory?: string;
  initialDate?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [category, setCategory] = useState(initialCategory ?? "");
  const [date, setDate] = useState(initialDate ?? "");
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [providerOptions, setProviderOptions] = useState<ProviderOption[]>([]);
  const [categoryError, setCategoryError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!category) {
      setProviderOptions([]);
      setSelectedProviderId("");
      return;
    }
    getProvidersByCategory(category).then((results) => {
      setProviderOptions(results);
      setSelectedProviderId("");
    });
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push("/authPage");
      return;
    }

    if (!category) {
      setCategoryError("Please select a service");
      return;
    }
    setCategoryError("");

    if (selectedProviderId) {
      router.push(
        date
          ? `/book/${selectedProviderId}?date=${date}`
          : `/book/${selectedProviderId}`
      );
      return;
    }

    const params = new URLSearchParams();
    params.set("serviceCategory", category);
    if (date) params.set("date", date);

    if (pathname === "/book") {
      router.push(`/book?${params.toString()}`, { scroll: false });
    } else {
      router.push(`/book?${params.toString()}`);
    }
  };

  return (
    <div className="bg-background">
      <div className="p-6 rounded-lg shadow-md border mx-6 lg:mx-20">
        <h2 className="text-xl font-bold text-foreground lg:text-3xl">
          Book an Appointment
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 mt-4 w-full lg:flex-row lg:items-start"
        >
          {/* Service category */}
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setCategoryError("");
              }}
              className={`w-full text-foreground bg-background border text-lg rounded-lg focus:ring-primary focus:border-primary p-2 ${
                categoryError ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Choose a Service</option>
              {categories.map((cat) => (
                <option value={cat.name} key={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categoryError && (
              <p className="text-red-500 text-xs">{categoryError}</p>
            )}
          </div>

          {/* Date */}
          <div className="flex-1 min-w-0">
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-foreground bg-background border border-gray-300 text-lg rounded-lg focus:ring-primary focus:border-primary p-2"
            />
          </div>

          {/* Professional */}
          <div className="flex-1 min-w-0">
            <select
              value={selectedProviderId}
              onChange={(e) => setSelectedProviderId(e.target.value)}
              disabled={!category}
              className="w-full text-foreground bg-background border border-gray-300 text-lg rounded-lg focus:ring-primary focus:border-primary p-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <option value="">
                {!category
                  ? "Select a service first"
                  : providerOptions.length === 0
                    ? "No providers for this category"
                    : "Any Professional"}
              </option>
              {providerOptions.map((p) => (
                <option value={p.userId} key={p.userId}>
                  {p.businessName}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full lg:w-auto">
            <MainButton
              type="submit"
              variant="primary"
              className="w-full lg:w-auto"
            >
              See Availability
            </MainButton>
          </div>
        </form>
      </div>
    </div>
  );
}
