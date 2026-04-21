import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function HomePage(): Promise<never> {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard/executive");
  }

  redirect("/login");
}
