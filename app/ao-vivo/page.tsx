import { redirect } from "next/navigation";

// Redirect to the live auctions filter
export default function AoVivoPage() {
  redirect("/leiloes?status=LIVE");
}
