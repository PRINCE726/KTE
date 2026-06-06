import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "../AdminSidebar";
import AdminTopbar from "../AdminTopbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_token")?.value === "true";

  // Si l'utilisateur n'est pas admin, il est renvoyé vers le login général
  if (!isAdmin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-[#1A1A1A] flex font-sans">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AdminTopbar />
        <main className="flex-1 p-6 md:p-10 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
