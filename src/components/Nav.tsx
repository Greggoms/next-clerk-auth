import Link from "next/link";
import { navLinks } from "@/lib/constants";

const Nav = () => {
  return (
    <nav>
      <ul className="flex items-center gap-4">
        {navLinks.map((link) => (
          <li key={link.text}>
            <Link href={link.url}>{link.text}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
