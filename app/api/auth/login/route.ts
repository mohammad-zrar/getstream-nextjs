import { NextRequest, NextResponse } from "next/server";
import { getDataSource } from "@/lib/db";
import { User } from "@/entities/User";
import { verifyPassword, signToken } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return errorResponse("All fields are required", 400);
    }

    const ds = await getDataSource();
    const userRepo = ds.getRepository(User);

    const user = await userRepo.findOne({ where: { email } });
    if (!user) {
      return errorResponse("Invalid credentials", 401);
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return errorResponse("Invalid credentials", 401);
    }

    const token = signToken({ id: user.id, email: user.email });

    const response = successResponse(
      { id: user.id, name: user.name, email: user.email },
      "Logged in successfully",
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
