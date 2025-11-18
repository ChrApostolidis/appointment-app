"use client";

import { categories } from "@/app/registerForms/data";
import FilterSection from "./FitlerSection";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Filters() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("serviceCategory");
  const router = useRouter();
  const pathname = usePathname();

  const createCategoryQuery = (categoryName: string) => {
    const params = new URLSearchParams(searchParams);

    if (selectedCategory === categoryName) {
      params.delete("serviceCategory");
    } else {
      params.set("serviceCategory", categoryName);
    }

    return `?${params.toString()}`;
  };

  const removeParams = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("serviceCategory");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  return (
    <div className="flex justify-center items-center lg:justify-start lg:items-start lg:ml-8">
      <div className="w-64 bg-background p-5 rounded-2xl shadow-lg border border-border">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground ">Filters</h2>
          {selectedCategory && (
            <button
              onClick={removeParams}
              className="cursor-pointer text-foreground hover:text-primary"
            >
              Clear
            </button>
          )}
        </div>

        <FilterSection title="Proffesions" scrollable>
          {categories.map((category) => (
            <Link
              key={category.id}
              scroll={false}
              href={createCategoryQuery(category.name)}
              className={`mr-2 text-foreground block hover:bg-primary-hover rounded px-2 py-1 ${
                selectedCategory === category.name
                  ? "bg-primary/50 font-medium"
                  : ""
              }`}
            >
              {category.name}
            </Link>
          ))}
        </FilterSection>

        <FilterSection title="Gender">
          <label className="block">
            <input type="checkbox" className="mr-2 bg-foreground" /> Male
          </label>
          <label className="block">
            <input type="checkbox" className="mr-2 bg-foreground" /> Female
          </label>
        </FilterSection>

        <FilterSection title="Availability">
          <label className="block">
            <input type="checkbox" className="mr-2 bg-foreground" /> Available
          </label>
          <label className="block">
            <input type="checkbox" className="mr-2 bg-foreground" /> Unavailable
          </label>
        </FilterSection>
      </div>
    </div>
  );
}
