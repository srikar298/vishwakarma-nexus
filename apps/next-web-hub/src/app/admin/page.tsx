import { Metadata } from 'next';
import { Admin } from "@/features/admin/components/Admin";

export const metadata: Metadata = {
  title: "Admin Portal | VKC",
  description: "Administrative dashboard for the Vishwakarma Knowledge Centre platform.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <Admin />;
}
