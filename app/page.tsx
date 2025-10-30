import Header from "./components/Header";
import { getCurrentUser } from "@/auth/currentUser";

export default async function Home() {
  const currentUser = await getCurrentUser({ withFullUser: true });

  if (!currentUser) {
    return "User not found";
  }  

  return (
    <div className="">
      <Header user={currentUser} />
      <h1 className="mt-5 text-2xl text-center text-primary">{`Welcome ${currentUser.name}`}</h1>
    </div>
  );
}
