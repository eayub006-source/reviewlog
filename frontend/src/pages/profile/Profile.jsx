import { CalendarDays, Mail, Pencil, User } from "lucide-react";

import Badge from "@/components/common/Badge";
import DashboardCard from "@/components/common/DashboardCard";
import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { useReviews } from "@/hooks/useReviews";

function Profile() {
  const { profile, loading, error } = useProfile();
  const { reviews } = useReviews({ scope: "mine" });

  const memberSince = profile?.date_joined
    ? new Date(profile.date_joined).toLocaleDateString("en", {
        month: "long",
        year: "numeric",
      })
    : "Unavailable from API";

  if (loading) {
    return <Loader label="Loading profile..." className="min-h-[50vh]" />;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <DashboardCard title="Profile" description="Your account information from the deployed backend.">
        {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
        <div className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-950 text-xl font-semibold text-white shadow-lg shadow-slate-950/10">
            {profile?.username?.slice(0, 1)?.toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-slate-500">Signed in as</p>
            <h2 className="truncate text-2xl font-semibold text-slate-950">{profile?.username ?? "Account"}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Manage your account details and keep your workspace secure.</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge tone="success">Authenticated</Badge>
              <Badge tone="subtle">{reviews.length} reviews</Badge>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          <ProfileRow icon={User} label="Username" value={profile?.username ?? "-"} />
          <ProfileRow icon={Mail} label="Email" value={profile?.email ?? "-"} />
          <ProfileRow icon={CalendarDays} label="Member Since" value={memberSince} />
          <ProfileRow icon={Pencil} label="Number of Reviews" value={reviews.length} />
        </div>
      </DashboardCard>

      <DashboardCard title="Profile Actions" description="Future account editing will live here.">
        <div className="space-y-4 text-sm leading-6 text-slate-600">
          <p>
            The current API does not expose profile update fields beyond the authenticated user record, so the edit action is prepared as a placeholder for the next backend phase.
          </p>
          <div className="rounded-3xl bg-slate-950 px-5 py-5 text-white">
            <p className="text-sm text-slate-300">Avatar placeholder</p>
            <div className="mt-4 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-white/10 text-2xl font-semibold backdrop-blur">
              {profile?.username?.slice(0, 1)?.toUpperCase() ?? "U"}
            </div>
          </div>
          <Button variant="outline" className="h-11 rounded-2xl px-5" disabled>
            <Pencil className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </DashboardCard>
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
