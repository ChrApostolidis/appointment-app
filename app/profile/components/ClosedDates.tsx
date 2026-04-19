"use client";

import { useState } from "react";
import { CalendarOff, Plus, X } from "lucide-react";
import MainButton from "@/app/components/MainButton";
import Modal from "./Modal";
import { updateProviderClosedDates } from "../actions/profileActions";
import { startOfToday } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

type ClosedDatesProps = {
  initialDates: string[];
};

export default function ClosedDates({ initialDates }: ClosedDatesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [closedDates, setClosedDates] = useState<string[]>(initialDates);
  const [pendingDates, setPendingDates] = useState<string[]>(initialDates);
  const [isSaving, setIsSaving] = useState(false);

  const today = startOfToday();

  const selectedDates = pendingDates.map((d) => new Date(d + "T00:00:00"));

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    const iso = date.toISOString().slice(0, 10);
    setPendingDates((prev) =>
      prev.includes(iso) ? prev.filter((d) => d !== iso) : [...prev, iso]
    );
  };

  const handleRemove = (date: string) => {
    setPendingDates((prev) => prev.filter((d) => d !== date));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProviderClosedDates(pendingDates);
      setClosedDates(pendingDates);
    } catch (err) {
      console.error("Failed to update closed dates:", err);
    } finally {
      setIsSaving(false);
      setIsModalOpen(false);
    }
  };

  const handleOpen = () => {
    setPendingDates(closedDates);
    setIsModalOpen(true);
  };

  const formatDate = (iso: string) =>
    new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="pt-6 border-t border-border bg-background">
      <div className="bg-background border border-border rounded-2xl shadow-lg p-2 pt-4 mb-6">
        <div className="flex gap-2 justify-center items-center mb-2 lg:justify-start">
          <CalendarOff className="w-6 h-6 text-primary lg:w-9 lg:h-9" />
          <h1 className="lg:text-3xl text-2xl font-bold text-foreground">
            Closed Dates
          </h1>
        </div>
        <div className="flex items-center mb-4 px-4">
          <p className="text-foreground text-xl">
            Block specific dates you won&apos;t be available
          </p>
        </div>
        <div className="flex items-center justify-center lg:justify-end">
          <MainButton
            onClick={handleOpen}
            className="flex items-center gap-2 hover:bg-indigo-700 text-foreground px-6 py-3 rounded-xl shadow-md hover:shadow-lg"
          >
            Manage Dates
            <Plus className="w-5 h-5" />
          </MainButton>
        </div>
      </div>

      {closedDates.length > 0 ? (
        <div className="flex flex-wrap gap-2 px-2">
          {closedDates
            .slice()
            .sort()
            .map((date) => (
              <span
                key={date}
                className="inline-flex items-center gap-1 rounded-full bg-muted border border-border px-3 py-1 text-sm text-foreground"
              >
                {formatDate(date)}
              </span>
            ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm px-2">No closed dates set.</p>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3 className="font-bold text-xl text-center lg:text-2xl mb-4">
          Manage Closed Dates
        </h3>
        <p className="text-sm text-muted-foreground text-center mb-4">
          Click a date to toggle it closed. Selected dates are highlighted.
        </p>

        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={undefined}
            onSelect={handleSelect}
            disabled={{ before: today }}
            modifiers={{ closed: selectedDates }}
            modifiersClassNames={{
              closed: "bg-primary text-primary-foreground rounded-md",
            }}
            captionLayout="dropdown"
            className="rounded-md border shadow-sm bg-background text-foreground"
          />
        </div>

        {pendingDates.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-foreground mb-2">
              Blocked dates:
            </p>
            <div className="flex flex-wrap gap-2">
              {pendingDates
                .slice()
                .sort()
                .map((date) => (
                  <span
                    key={date}
                    className="inline-flex items-center gap-1 rounded-full bg-muted border border-border px-3 py-1 text-sm text-foreground"
                  >
                    {formatDate(date)}
                    <button
                      onClick={() => handleRemove(date)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
            </div>
          </div>
        )}

        <div className="flex justify-center mt-6">
          <MainButton
            onClick={handleSave}
            disabled={isSaving}
            className="w-full"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </MainButton>
        </div>
      </Modal>
    </div>
  );
}
