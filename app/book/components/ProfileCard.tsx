import MainButton from "@/app/components/MainButton";
import Image from "next/image";
import { providers } from "../actions/actions";

export default async function ProfileCard({
  providers,
}: {
  providers: providers[];
}) {
  return (
    <>
      {providers.map((provider) => (
        <div
          key={provider.id}
          className="flex flex-col border border-muted rounded-md p-5 mb-20 mx-2 lg:mx-5 gap-5 lg:flex-row"
        >
          {provider.logoUrl ? (
            <div className="border border-muted rounded-md p-1">
              <Image
                src={provider.logoUrl}
                alt="Profile Picture"
                width={270}
                height={200}
              />
            </div>
          ) : (
            <div className="border border-muted rounded-md p-1 w-[270px] h-[200px] flex items-center justify-center bg-slate-100">
              <p className="text-slate-400">No Logo</p>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between">
              <p className="text-lg">{provider.serviceCategory}</p>
              <p className="text-green-500">Available</p>
            </div>
            <div className="flex flex-col justify-between">
              <div className="flex justify-between">
                <h3>{provider.businessName}</h3>
                <p>Location</p>
              </div>
              <div>
                <p className="mt-2">{provider.description}</p>
              </div>
              <div>
                <p>(Display Hours)</p>
              </div>
            </div>
            <div className="lg:relative lg:flex lg:justify-end">
              <MainButton
                variant="secondary"
                className="w-full lg:absolute lg:top-30 lg:w-[200px]"
              >
                Book Appointment
              </MainButton>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
