import { categories } from "@/app/registerForms/data";
import FilterSection from "./FitlerSection";

export default function Filters() {
  return (
   <div className="flex justify-center items-center lg:justify-start lg:items-start lg:ml-8">
      <div className="w-64 bg-background p-5 rounded-2xl shadow-lg border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">Filters</h2>

        <FilterSection title="Proffesions" scrollable>
          {categories.map((category) => (
            <label key={category.id} className="block">
              <input type="checkbox" className="mr-2 bg-foreground" /> {category.name}
            </label>
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
