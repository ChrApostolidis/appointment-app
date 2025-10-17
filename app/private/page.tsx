// import { ToggleRoleButton } from "./components/ToggleRoleButton"
import { getCurrentUser } from "@/auth/currentUser"
import PrivatePageClient from "./components/privatePageClient";

export default async function PrivatePage() {
  const currentUser = await getCurrentUser({ redirectIfNotFound: true })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl mb-8">Private: {currentUser.role}</h1>
      <div className="flex gap-2">
        {/* <ToggleRoleButton onClick={() => {isOpen = !isOpen}} /> */}
        <PrivatePageClient />
        </div>
    </div>
  )
}