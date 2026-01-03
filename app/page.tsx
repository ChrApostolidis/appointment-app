import Header from "./components/Header";
import { getCurrentUser } from "@/auth/currentUser";
import HeroSection from "./components/HeroSection";
import BookAppoinmentSearchBar from "./components/BookAppoinmentSearchBar";
import IconSlider from "./components/IconSlider";

export default async function Home() {
  const currentUser = await getCurrentUser({ withFullUser: true });

  return (
    <div className="">
      <Header user={currentUser} />
      <HeroSection user={currentUser}/>
      <BookAppoinmentSearchBar />
      <IconSlider />
    </div>
  );
}
