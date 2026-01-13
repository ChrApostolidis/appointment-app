"use client";
import MainButton from "@/app/components/MainButton";
import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaRegCopyright,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import { footerData } from "@/app/data/FooterData";

export default function Footer() {
  const d = new Date();
  const year = d.getFullYear();
  return (
    <div className="mt-10 w-full">
      <div className="flex flex-col justify-center gap-5 items-center lg:flex-row lg:justify-around pb-10 border-b border-muted lg:mx-7">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="p text-4xl font-bold text-center lg:text-6xl">
            Power up your <span className="block">scheduling</span>
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-5"
        >
          <div className="lg:my-7 text-lg">
            <p>Get started in seconds - for free</p>
          </div>
          <div className="flex flex-col lg:flex-row gap-7">
            <MainButton variant="primary">Get Started</MainButton>
            <button className="cursor-pointer bg-gray-500 p-2 lg:p-3 rounded-md border border-gray-400 hover:bg-primary/90 hover:text-black text-foreground">
              Get a demo
            </button>
          </div>
        </motion.div>
      </div>
      <div>
        <div className="mx-7 mt-5 flex flex-col lg:flex-row lg:gap-25 lg:justify-center">
          {Object.entries(footerData).map(([title, items]) => (
            <div key={title} className="m-5">
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                {title}
              </h3>
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li
                    key={item}
                    className="cursor-pointer hover:text-primary/80"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-5 my-1 border-b border-muted lg:mx-7">
          <div className="flex lg:justify-end justify-center items-center p-5">
            <div className="flex gap-2.5 text-center">
              <FaFacebookF size={24} className="cursor-pointer" />
              <FaInstagram size={24} className="cursor-pointer" />
              <FaLinkedin size={24} className="cursor-pointer" />
              <FaXTwitter size={24} className="cursor-pointer" />
              <FaYoutube size={24} className="cursor-pointer" />
            </div>
          </div>
        </div>
        <div className="mx-7 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5">
          <div className="text-lg">
            <button className="my-2 flex justify-center items-center gap-2 border border-muted px-3 py-1 rounded-md">
              <span>
                <FaGlobe />
              </span>
              <span>English</span>
              <span className="text-xl">
                <IoIosArrowDown />
              </span>
            </button>
          </div>
          <div className="flex flex-col justify-center items-center text-[12px] my-2 lg:flex-row gap-2">
            <div className="flex gap-2">
              <button className="cursor-pointer hover:text-primary/80">
                Privay Policy
              </button>
              <button className="cursor-pointer hover:text-primary/80">
                Terms of Service
              </button>
              <button className="cursor-pointer hover:text-primary/80">
                Legal
              </button>
            </div>
            <div className="flex gap-2">
              <button className="cursor-pointer hover:text-primary/80">
                Privacy Choices
              </button>
              <button className="cursor-pointer hover:text-primary/80">
                Cookie Settings
              </button>
            </div>
          </div>
          <div className="flex justify-center gap-2 text-sm items-center">
            <FaRegCopyright size={16} />
            <p>Copyright AppointMe {year}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
