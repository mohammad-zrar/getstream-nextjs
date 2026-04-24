"use server";

import { User } from "@/database/entities/User";
import { hashPassword, signToken, verifyPassword } from "@/lib/auth";
import { getDataSource } from "@/database/db";
import { upsertStreamUser } from "@/actions/getstream";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function registerAction(_: unknown, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const ds = await getDataSource();
  const userRepo = ds.getRepository(User);

  const existing = await userRepo.findOne({ where: { email } });
  if (existing) return { error: "Email already in use" };

  const user = userRepo.create({
    name,
    email,
    password: await hashPassword(password),
  });
  await userRepo.save(user);

  await upsertStreamUser(user.id, user.name);

  const token = signToken({ id: user.id, email: user.email });
  await setAuthCookie(token);

  redirect("/");
}

export async function loginAction(_: unknown, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const ds = await getDataSource();
  const userRepo = ds.getRepository(User);

  const user = await userRepo.findOne({ where: { email } });
  if (!user) return { error: "Invalid credentials" };

  const valid = await verifyPassword(password, user.password);
  if (!valid) return { error: "Invalid credentials" };

  await upsertStreamUser(user.id, user.name);

  const token = signToken({ id: user.id, email: user.email });
  await setAuthCookie(token);

  redirect("/");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  redirect("/login");
}
