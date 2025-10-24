import { getCurrentUser } from "@/auth/currentUser"
import RegisterProviderPage from "../provider/page"

export default async function LockedRegisterFormData() {
    const user = await getCurrentUser({ withFullUser: true })

    if (!user) {
        return null
    }

    return (
        <RegisterProviderPage user={user} />
    )
}