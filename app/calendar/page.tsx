"use server";
import { redirect } from "next/navigation"
import Header from "../components/Header";
import CalendarComponent from "./components/CalendarComponent";
import { getCurrentUser } from "@/auth/currentUser";

export default async function CalendarPage() {
  const currentUser = await getCurrentUser({ withFullUser: true });

  if (!currentUser) {
    redirect("/authPage")
  }

  return (
    <div className="bg-gradient-to-b from-background via-background/95 to-muted pt-8 lg:pt-12">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-16 lg:px-0">
        <Header user={currentUser} />
        <section className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-2xl shadow-black/5 backdrop-blur-sm lg:p-8">
          <header className="border-b border-border/60 pb-6 text-center">
            <h3 className="text-3xl font-semibold text-foreground lg:text-4xl">Your Calendar</h3>
            <p className="mt-2 text-base text-muted-foreground">View upcoming appointments and keep your schedule organized.</p>
          </header>
          <div className="mt-6 rounded-2xl border border-dashed border-border bg-background p-4 lg:p-6">
            <CalendarComponent />
          </div>
        </section>
      </div>
    </div>
  );
}
