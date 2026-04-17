import { generateUserToken } from "@/actions/getstream";

export default async function GetStreamPage() {
  const token = await generateUserToken();
  console.log("Generated token:", token);
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <h1 className="text-2xl font-bold">GetStream Page</h1>
      <p>Generated token: {token}</p>
    </div>
  );
}
