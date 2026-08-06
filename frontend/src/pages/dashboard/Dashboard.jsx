import { BarChart3, Mail, User } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

function Dashboard() {
  const { currentUser } = useAuth();

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <CardHeader>
          <CardDescription>Welcome back</CardDescription>
          <CardTitle>Welcome, {currentUser?.username ?? "Reviewer"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DashboardRow icon={User} label="Username" value={currentUser?.username ?? "-"} />
          <DashboardRow icon={Mail} label="Email" value={currentUser?.email ?? "-"} />
          <DashboardRow icon={BarChart3} label="Total Reviews" value="Phase 2" muted />
        </CardContent>
      </Card>

      <Card className="bg-slate-950 text-white">
        <CardHeader>
          <CardDescription className="text-slate-300">Session status</CardDescription>
          <CardTitle className="text-white">Authentication is live</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <p>The frontend is connected to the deployed Render API, stores JWTs in local storage, and refreshes them automatically.</p>
          <p>Use the navigation above to open protected profile, reviews, and settings routes.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardRow({ icon: Icon, label, value, muted = false }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
        <Icon className="h-4 w-4 text-slate-900" />
        {label}
      </div>
      <div className={`text-sm font-semibold ${muted ? "text-slate-500" : "text-slate-950"}`}>{value}</div>
    </div>
  );
}

export default Dashboard;