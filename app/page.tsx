import Header from "./components/Header";
import { getCurrentUser } from "@/auth/currentUser";
import HeroSection from "./components/HeroSection";
import BookAppoinmentSearchBar from "./components/BookAppoinmentSearchBar";
import EventsStepper from "./components/EventsStepper";
import Reminders from "./components/Reminders";
import BookingMarketingComponent from "./components/BookingMarketingComponent";

export default async function Home() {
  const currentUser = await getCurrentUser({ withFullUser: true });

  return (
    <div className="">
      <Header user={currentUser} />
      <HeroSection user={currentUser}/>
      <BookAppoinmentSearchBar />
      <EventsStepper />
      <Reminders />
      <BookingMarketingComponent />
    </div>
  );
}
