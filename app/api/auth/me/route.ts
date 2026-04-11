import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getDataSource } from "@/lib/db";
import { User } from "@/entities/User";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return errorResponse("Unauthenticated", 401);
    }

    const payload = verifyToken(token);
    const ds = await getDataSource();
    const user = await ds
      .getRepository(User)
      .findOne({ where: { id: payload.id } });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    return successResponse({ id: user.id, name: user.name, email: user.email });
  } catch {
    return errorResponse("Invalid token", 401);
  }
}
