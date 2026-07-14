import { Metadata } from 'next';
import { MembershipPage } from "@/features/onboarding/pages/MembershipPage";

export const metadata: Metadata = {
  title: "Claim Your Digital Artisan Identity | VKC",
  description: "Join the VKC global network and claim your Digital Artisan Identity card. Complete the registration to generate your unique Artisan ID card in real-time.",
  keywords: ["Artisan Identity", "Digital ID", "VKC Membership", "Artisan Registry", "Join VKC"],
};

export default function Page() {
  return <MembershipPage />;
}
