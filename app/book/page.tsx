import { getCurrentUser } from "@/auth/currentUser";
import BookAppoinmentSearchBar from "../components/BookAppoinmentSearchBar";
import Header from "../components/Header";
import Filters from "./components/Filters";
import ProfileCard from "./components/ProfileCard";
import { getFilteredProviders, providers } from "./actions/actions";
import { Suspense } from "react";
import Loading from "./components/Loading";
import PaginationControls from "./components/PaginationControls";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const currentUser = await getCurrentUser({ withFullUser: true });
  // Search Params
  const sp = await searchParams;
  const rawServiceCategory = sp?.serviceCategory;
  const serviceCategory = Array.isArray(rawServiceCategory)
    ? rawServiceCategory[0]
    : rawServiceCategory;

  // Pagination
  const page = sp["page"] ?? "1";
  const per_page = sp["per_page"] ?? "4";

  const { filteredProviders, startIndex, endIndex, totalCount }: { filteredProviders: providers[]; startIndex: number; endIndex: number; totalCount: number } = await getFilteredProviders(
    {
      serviceCategory: serviceCategory,
    },
    page,
    per_page
  );

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
          {filteredProviders && <ProfileCard providers={filteredProviders} />}
        </Suspense>
      </div>
      <PaginationControls
        hasNextPage={endIndex < totalCount}
        hasPrevPage={startIndex > 0}
        total={totalCount}
      />
    </div>
  );
}
