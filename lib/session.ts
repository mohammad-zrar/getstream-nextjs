import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { getDataSource } from "@/database/db";
import { User } from "@/database/entities/User";

export async function getSession(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    const ds = await getDataSource();
    const user = await ds
      .getRepository(User)
      .findOne({ where: { id: payload.id } });

    return user ?? null;
  } catch {
    return null;
  }
}
