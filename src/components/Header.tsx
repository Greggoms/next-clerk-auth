import { UserButton, currentUser } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/api";

import Link from "next/link";
import Nav from "./Nav";

const Header = async () => {
  const user: User | null = await currentUser();

  return (
    <header className="p-3 dark:bg-slate-800">
      <div className="container flex items-center justify-between">
        <h2>
          <Link href="/">clerk-auth</Link>
        </h2>
        <div className="flex items-center gap-8">
          <Nav />
          {user?.id ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
