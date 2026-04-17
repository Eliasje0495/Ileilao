import { redirect } from "next/navigation";

// Featured auctions — redirect to main listing sorted by featured
export default function LeiloesDestaquePage() {
  redirect("/leiloes?sort=destaque");
}
