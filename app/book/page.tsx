import { getCurrentUser } from "@/auth/currentUser";
import BookAppoinmentSearchBar from "../components/BookAppoinmentSearchBar";
import Header from "../components/Header";
import Filters from "./components/Filters";
import ProfileCard from "./components/ProfileCard";

export default async function BookPage() {
  const currentUser = await getCurrentUser({ withFullUser: true });

  if (!currentUser) {
    return "User not found";
  }

  return (
    <div>
      <Header user={currentUser} />
      <div className="text-center mt-10">
        <h2 className="text-3xl">Book Appointment</h2>
      </div>
      <div className="mt-20">
        <BookAppoinmentSearchBar />
      </div>
     <div className="flex flex-col gap-10 lg:flex-row lg:mx-12">
        <Filters />
        <ProfileCard />
     </div>
    </div>
  );
}
