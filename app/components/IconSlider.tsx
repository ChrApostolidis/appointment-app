// import Image from "next/image";
// import {
//   FaWindows,
//   FaApple,
//   FaLinux,
//   FaAndroid,
//   FaChrome,
//   FaFirefox,
//   FaEdge,
// } from "react-icons/fa";
// import { SiMacos, SiAppletv } from "react-icons/si";

const icons = [
  {
    id: 1,
    name: "Dropbox",
    icon: "https://cdn.brandfetch.io/dropbox.com/w/512/h/341/symbol?c=1idISKhQNf63FCQ-I-R",
  },
  {
    id: 2,
    name: "Dropbox",
    icon: "https://cdn.brandfetch.io/dropbox.com/w/512/h/341/symbol?c=1idISKhQNf63FCQ-I-R",
  },
  {
    id: 3,
    name: "Dropbox",
    icon: "https://cdn.brandfetch.io/dropbox.com/w/512/h/341/symbol?c=1idISKhQNf63FCQ-I-R",
  },
  {
    id: 4,
    name: "Dropbox",
    icon: "https://cdn.brandfetch.io/dropbox.com/w/512/h/341/symbol?c=1idISKhQNf63FCQ-I-R",
  },
  {
    id: 5,
    name: "Dropbox",
    icon: "https://cdn.brandfetch.io/dropbox.com/w/512/h/341/symbol?c=1idISKhQNf63FCQ-I-R",
  },
  {
    id: 6,
    name: "Dropbox",
    icon: "https://cdn.brandfetch.io/dropbox.com/w/512/h/341/symbol?c=1idISKhQNf63FCQ-I-R",
  },
  {
    id: 7,
    name: "Dropbox",
    icon: "https://cdn.brandfetch.io/dropbox.com/w/512/h/341/symbol?c=1idISKhQNf63FCQ-I-R",
  },
];

const IconList = ({ keyPrefix = "" }) => (
  <ul className="flex gap-10 text-white py-4 shrink-0">
    {icons.map((icon) => (
      <li
        key={`${keyPrefix}${icon.id}`}
        className="flex flex-col items-center gap-5 min-w-[100px] first:ml-5"
      >
        <div className="flex justify-center items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={icon.icon} alt={icon.name} className="w-10 h-10" />
          <span className="text-sm lg:text-base font-medium">{icon.name}</span>
        </div>
      </li>
    ))}
  </ul>
);

const IconSlider = () => {
  return (
    <div className="w-full bg-background py-8">
      <div className="overflow-hidden">
        <p className="text-white text-md text-center mx-2 my-5 font-bold lg:text-lg lg:my-7">
          Trusted by more than <span className="text-primary">100,000</span> of
          the world’s leading organizations
        </p>

        <div className="flex animate-infinite-scroll">
          <IconList keyPrefix="set1-" />
          <IconList keyPrefix="set2-" />
          <IconList keyPrefix="set2-" />
        </div>
      </div>
    </div>
  );
};

export default IconSlider;
