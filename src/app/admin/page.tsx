import { AdminDashboard } from "@/components/admin-dashboard";

export const metadata = {
  title: "Admin · La Darka",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboard />;
}
