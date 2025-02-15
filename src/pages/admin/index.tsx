
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { useAdminData } from "@/hooks/useAdminData";

export default function AdminPage() {
  const {
    profiles,
    stories,
    payments,
    promptLogs,
    systemPrompts,
    isAdmin,
    loading,
  } = useAdminData();

  if (!isAdmin || loading) {
    return <AdminLoading />;
  }

  return (
    <AdminLayout>
      <AdminTabs
        profiles={profiles}
        stories={stories}
        payments={payments}
        promptLogs={promptLogs}
        systemPrompts={systemPrompts}
      />
    </AdminLayout>
  );
}
