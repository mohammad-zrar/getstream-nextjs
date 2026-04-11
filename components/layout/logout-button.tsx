"use client";

import { Button } from "@/components/ui/button";
import { logoutAction } from "@/actions/auth";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button variant="ghost" type="submit">
        Logout
      </Button>
    </form>
  );
}
