import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";
import LogoutButton from "@/components/layout/logout-button";

export default async function Navbar() {
  const user = await getSession();

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold">
          Get Stream
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground">
                Hi, {user.name.split(" ")[0]}
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" passHref>
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register" passHref>
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
