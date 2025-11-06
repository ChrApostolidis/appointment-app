import MainButton from "@/app/components/MainButton";
import Image from "next/image";

export default function ProfileCard() {
  return (
    <div className="flex flex-col border border-muted rounded-md p-5 mb-20 mx-2 lg:mx-5 gap-5 lg:flex-row">
      <div className="border border-muted rounded-md p-1">
        <Image
          src="/test_profile_picture.png"
          alt="Profile Picture"
          width={270}
          height={200}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <p className="text-lg">Painter</p>
          <p className="text-green-500">Available</p>
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex justify-between">
            <h3>Business Name</h3>
            <p>Location</p>
          </div>
          <div>
            <p className="mt-2">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto
              non omnis iure tempora provident obcaecati!
            </p>
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
  );
}
