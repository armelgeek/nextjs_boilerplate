import { redirect } from "next/navigation";
import { getRedirectUrl } from "@/actions/users/get-redirect-url";

export default async function CallbackPage() {
  
  const redirectUrl = await getRedirectUrl();
  redirect(redirectUrl);
}
