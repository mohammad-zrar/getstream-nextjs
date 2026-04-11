import { NextRequest } from "next/server";
import { getDataSource } from "@/lib/db";
import { User } from "@/entities/User";
import { hashPassword, signToken } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return errorResponse("All fields are required", 400);
    }

    const ds = await getDataSource();
    const userRepo = ds.getRepository(User);

    const existing = await userRepo.findOne({ where: { email } });
    if (existing) {
      return errorResponse("Email already in use", 409);
    }

    const user = userRepo.create({
      name,
      email,
      password: await hashPassword(password),
    });

    await userRepo.save(user);

    const token = signToken({ id: user.id, email: user.email });

    const response = successResponse(
      { id: user.id, name: user.name, email: user.email },
      "Registered successfully",
      201,
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
