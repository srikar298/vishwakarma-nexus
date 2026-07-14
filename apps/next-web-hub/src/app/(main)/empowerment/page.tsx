import { Metadata } from 'next';
import { EmpowermentPage } from "@/features/empowerment/pages/EmpowermentPage";

export const metadata: Metadata = {
  title: "Political Empowerment & Rights | VKC Advocacy",
  description: "Explore data and advocacy efforts regarding the Vishwakarma community's social, political, and reservation rights. Join our census and voice your representation.",
  keywords: ["Political Empowerment", "Advocacy", "Artisan Rights", "OBC Reservation", "Community Census", "PM Vishwakarma Scheme"],
};

export default function Page() {
  return <EmpowermentPage />;
}
