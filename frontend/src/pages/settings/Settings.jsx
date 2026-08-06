import { useNavigate } from "react-router-dom";
import { LogOut, ShieldCheck, UserCog } from "lucide-react";

import DashboardCard from "@/components/common/DashboardCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

function Settings() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <DashboardCard title="Security and session" description="Account access controls and logout management.">
        <div className="space-y-4 text-sm text-slate-600">
          <SettingItem icon={ShieldCheck} title="JWT session" description="Access and refresh tokens are refreshed automatically." />
          <SettingItem icon={UserCog} title="Profile ownership" description={`Signed in as ${currentUser?.username ?? "your account"}.`} />
          <Button variant="outline" size="sm" onClick={handleLogout} className="h-10 rounded-full px-4">
            <LogOut className="h-4 w-4" />
            Logout now
          </Button>
        </div>
      </DashboardCard>

      <DashboardCard title="Preference center" description="Future settings and personalization live here." className="bg-slate-950 text-white">
        <div className="space-y-3 text-sm text-slate-300">
          <p>Future updates can add notification preferences, theme controls, and account editing here.</p>
          <p>For phase 1, the important part is that the user is fully authenticated and protected.</p>
        </div>
      </DashboardCard>
    </div>
  );
}

function SettingItem({ icon: Icon, title, description }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-950">{title}</h3>
        <p className="mt-1 leading-6 text-slate-600">{description}</p>
      </div>
    </div>
  );
}

export default Settings;
