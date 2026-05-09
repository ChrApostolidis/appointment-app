import Header from "./components/Header";
import { getCurrentUser } from "@/auth/currentUser";
import HeroSection from "./marketingPageComponents/HeroSection";
import SpecialistFinderBanner from "./components/SpecialistFinderBanner";
import EventsStepper from "./marketingPageComponents/EventsStepper";
import Reminders from "./marketingPageComponents/Reminders";
import BookingMarketingComponent from "./marketingPageComponents/BookingMarketingComponent";
import MarketingCalendarComponent from "./marketingPageComponents/MarketingCalendarComponent";
import Footer from "./components/Footer";
import AutomateEverythingMarketingComponent from "./marketingPageComponents/AutomateEverythingMarketing";
import UsersTestimonials from "./marketingPageComponents/UsersTestimonials";

export default async function Home() {
  const currentUser = await getCurrentUser({ withFullUser: true });

  return (
    <div className="bg-background">
      <Header user={currentUser} />
      <HeroSection user={currentUser}/>
      {currentUser && <SpecialistFinderBanner />}
      <EventsStepper />
      <Reminders />
      <BookingMarketingComponent />
      <MarketingCalendarComponent />
      <UsersTestimonials />
      <AutomateEverythingMarketingComponent />
      <Footer />
    </div>
  );
}
