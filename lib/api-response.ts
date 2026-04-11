import { NextResponse } from "next/server";

type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

type ApiErrorResponse = {
  success: false;
  message: string;
  error?: string;
};

export function successResponse<T>(
  data: T,
  message: string = "Success",
  status: number = 200,
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ success: true, message, data }, { status });
}

export function errorResponse(
  message: string,
  status: number = 500,
  error?: string,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    { success: false, message, ...(error && { error }) },
    { status },
  );
}
