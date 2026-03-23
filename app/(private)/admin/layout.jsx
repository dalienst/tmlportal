import AdminNavbar from "@/components/general/Navbar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50/30 flex flex-col">
      <AdminNavbar />
      <main className="flex-1 w-full bg-slate-50/50">
        {children}
      </main>
    </div>
  );
}
