"use client";

import { userType } from "../registerForms/components/LockedRegisterForm";

interface NavMenuItem {
  name: string;
  link: string;
}

export default function NavMenu({ user }: { user: userType }) {
  let NavMenuItems: NavMenuItem[] = [];

  if (user.role === "user") {
    NavMenuItems = [
      { name: "My Appointments", link: "/myAppointments" },
      { name: "Book", link: "/book" },
      { name: "Calendar", link: "/" },
    ];
  } else if (user.role === "provider") {
    NavMenuItems = [
      { name: "My Appointments", link: "/myAppointments" },
      { name: "Services", link: "/profile" },
      { name: "Calendar", link: "/" },
    ];
  }

  return (
    <div className="hidden lg:flex gap-10 items-center">
      <nav className="">
        <ul className="flex space-x-8">
          {NavMenuItems.map(({ name, link }) => (
            <li key={name}>
              <a
                href={link}
                className="text-foreground hover:text-primary lg:text-xl"
              >
                {name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
