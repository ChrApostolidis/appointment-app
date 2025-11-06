"use client";

interface NavMenuItem {
  name: string;
  link: string;
}

export default function NavMenu() {
  const NavMenuItems: NavMenuItem[] = [
    { name: "My Appointments", link: "events" },
    { name: "Book", link: "book" },
    { name: "Calendar", link: "calendar" },
  ];
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
