import LogOutButton from "@/auth/components/LogOutButton";
import Header from "./components/Header";
import { getCurrentUser } from "@/auth/currentUser";

export default async function Home() {
  const currentUser = await getCurrentUser({ withFullUser: true });

  if (!currentUser) {
    return "User not found";
  }

  return (
    <div>
      <Header user={currentUser} />
      <h1>Welcome</h1>
      <LogOutButton />
    </div>
  );
}
