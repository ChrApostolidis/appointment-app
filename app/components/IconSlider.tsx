import { icons } from "../data/icons";

const IconList = ({ keyPrefix = "" }) => (
  <ul className="flex gap-20 text-white py-4 shrink-0">
    {icons.map((icon) => (
      <li
        key={`${keyPrefix}${icon.id}`}
        className="flex justify-center flex-col items-center gap-5 min-w-[100px] first:ml-5"
      >
        <div className="flex justify-center items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={icon.icon} alt={icon.name} />
        </div>
      </li>
    ))}
  </ul>
);

export default function IconSlider() {
  return (
    <div className="w-full bg-background py-8">
      <div className="overflow-hidden">
        <p className="text-white text-md text-center mx-2 my-5 font-bold lg:text-lg lg:my-7">
          Trusted by more than <span className="text-primary">100,000</span> of
          the world’s leading organizations
        </p>

        <div className="flex gap-20 animate-infinite-scroll">
          <IconList keyPrefix="set1-" />
          <IconList keyPrefix="set2-" />
          <IconList keyPrefix="set3-" />
          <IconList keyPrefix="set4-" />
        </div>
      </div>
    </div>
  );
};

