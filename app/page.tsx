import Header from "./components/Header";
import { getCurrentUser } from "@/auth/currentUser";
import HeroSection from "./components/HeroSection";
import BookAppoinmentSearchBar from "./components/BookAppoinmentSearchBar";

export default async function Home() {
  const currentUser = await getCurrentUser({ withFullUser: true });

  if (!currentUser) {
    return "User not found";
  }

  return (
    <div className="">
      <Header user={currentUser} />
      <HeroSection user={currentUser}/>
      <BookAppoinmentSearchBar />
    </div>
  );
}
