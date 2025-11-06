import { categories } from "../registerForms/data";
import { MapPin } from "lucide-react";
import MainButton from "./MainButton";

export default function BookAppoinmentSearchBar() {
  return (
    <div className="bg-background p-6 rounded-lg shadow-md border mx-6 lg:mx-20 mb-10">
      <h2 className="text-xl font-bold text-foreground lg:text-3xl">
        Book an Appoinment
      </h2>
      <div className="flex flex-col gap-4 mt-4 w-full lg:flex-row lg:items-center">
       <form className="flex flex-col gap-4 mt-4 w-full lg:flex-row lg:items-center">
          <div className="flex-1 min-w-0">
            <select
              defaultValue="Choose any Service"
              className="w-full text-foreground bg-background border border-gray-300 text-lg rounded-lg focus:ring-primary focus:border-primary p-2"
            >
              {categories.map((category) => (
                <option value={category.name} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
  
          <div className="flex-1 min-w-0">
            <input
              type="date"
              className="w-full text-foreground bg-background border border-gray-300 text-lg rounded-lg focus:ring-primary focus:border-primary p-2"
            />
          </div>
  
              <div className="flex-1 min-w-0">
                <label htmlFor="location" className="sr-only">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground pointer-events-none" size={18} />
                  <input
                    id="location"
                    type="text"
                    placeholder="Location"
                    className="w-full text-foreground bg-background border border-gray-300 text-lg rounded-lg focus:ring-primary focus:border-primary p-2 pr-10"
                  />
                </div>
              </div>
  
          <div className="flex-1 min-w-0">
            <select className="w-full text-foreground bg-background border border-gray-300 text-lg rounded-lg focus:ring-primary focus:border-primary p-2">
              <option value="">Choose Professional</option>
            </select>
          </div>
  
        <div className="w-full lg:w-auto">
          <MainButton className="w-full lg:w-auto">See Availability</MainButton>
        </div>
       </form>
      </div>
    </div>
  );
}
