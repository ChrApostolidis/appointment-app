import { getCurrentUser } from "@/auth/currentUser";
import BookAppoinmentSearchBar from "../components/BookAppoinmentSearchBar";
import Header from "../components/Header";
import Filters from "./components/Filters";
import ProfileCard from "./components/ProfileCard";
import { getFilteredProviders, providers } from "./actions/actions";
import { Suspense } from "react";
import Loading from "./components/Loading";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const currentUser = await getCurrentUser({ withFullUser: true });

  const sp = await searchParams;

  const rawServiceCategory = sp?.serviceCategory;
  const serviceCategory = Array.isArray(rawServiceCategory)
    ? rawServiceCategory[0]
    : rawServiceCategory;

  const providers: providers[] = await getFilteredProviders({
    serviceCategory: serviceCategory,
  });

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
        <Suspense fallback={<Loading>Loading providers...</Loading>}>
          {providers && <ProfileCard providers={providers} />}
        </Suspense>
      </div>
    </div>
  );
}
