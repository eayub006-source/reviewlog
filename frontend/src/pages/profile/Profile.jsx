import { User, Mail, BadgeCheck } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

function Profile() {
  const { currentUser } = useAuth();

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardDescription>Account profile</CardDescription>
          <CardTitle>Current user details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProfileRow icon={User} label="Username" value={currentUser?.username ?? "-"} />
          <ProfileRow icon={Mail} label="Email" value={currentUser?.email ?? "-"} />
          <ProfileRow icon={BadgeCheck} label="Status" value="Authenticated" />
        </CardContent>
      </Card>

      <Card className="bg-slate-950 text-white">
        <CardHeader>
          <CardDescription className="text-slate-300">Session summary</CardDescription>
          <CardTitle className="text-white">ReviewLog access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <p>The app keeps the active JWT pair in local storage and refreshes access tokens automatically.</p>
          <p>Use this section later for profile edits, notification preferences, and account settings.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
        <Icon className="h-4 w-4 text-slate-900" />
        {label}
      </div>
      <div className="text-sm font-semibold text-slate-950">{value}</div>
    </div>
  );
}

export default Profile;
