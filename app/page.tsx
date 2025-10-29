import LogOutButton from "@/auth/components/LogOutButton";
import Header from "./components/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <h1>Welcome</h1>
      <LogOutButton />
    </div>
  );
}
