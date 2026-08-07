import { ArrowRight, BookOpen, Globe2, PlusCircle, User, Mail, BarChart3 } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import DashboardCard from "@/components/common/DashboardCard";
import EmptyState from "@/components/common/EmptyState";
import ReviewCard from "@/components/common/ReviewCard";
import StatsCard from "@/components/common/StatsCard";
import { DashboardSkeleton } from "@/components/common/Skeleton";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { useReviews } from "@/hooks/useReviews";

function Dashboard() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { reviews, loading } = useReviews({ scope: "mine" });

  const stats = useMemo(() => {
    const totalReviews = reviews.length;
    const publicReviews = reviews.filter((review) => review.is_public).length;
    const privateReviews = reviews.filter((review) => !review.is_public).length;
    const averageRating = totalReviews > 0 ? (reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / totalReviews).toFixed(1) : "0.0";

    return {
      totalReviews,
      publicReviews,
      privateReviews,
      averageRating,
    };
  }, [reviews]);

  const recentReviews = useMemo(() => [...reviews].sort((left, right) => new Date(right.date) - new Date(left.date)).slice(0, 3), [reviews]);

  if (!profile || loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <DashboardCard title={`Welcome, ${profile?.username ?? "Reviewer"}`} description="Your ReviewLog dashboard overview.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard title="Total Reviews" value={stats.totalReviews} icon={BookOpen} />
          <StatsCard title="Public Reviews" value={stats.publicReviews} icon={Globe2} tone="accent" />
          <StatsCard title="Private Reviews" value={stats.privateReviews} icon={User} tone="subtle" />
          <StatsCard title="Average Rating" value={stats.averageRating} icon={BarChart3} />
        </div>
      </DashboardCard>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardCard title="Quick Actions" description="Jump to the most common review tasks.">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { title: "Create Review", description: "Start a new review entry.", icon: PlusCircle, action: () => navigate("/reviews/new") },
              { title: "My Reviews", description: "Review and manage your entries.", icon: BookOpen, action: () => navigate("/reviews") },
              { title: "Public Reviews", description: "Browse published content.", icon: Globe2, action: () => navigate("/public-reviews") },
              { title: "Profile", description: "Inspect your account details.", icon: User, action: () => navigate("/profile") },
            ].map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={item.action}
                className="group rounded-3xl border border-slate-200 bg-slate-50 p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="rounded-2xl bg-slate-950 p-3 text-white">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
              </button>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Profile Snapshot" description="Current account data loaded from the backend.">
          <div className="space-y-4">
            <ProfileField label="Username" value={profile?.username ?? "-"} />
            <ProfileField label="Email" value={profile?.email ?? "-"} />
            <ProfileField label="Member Since" value={profile?.date_joined ? new Date(profile.date_joined).toLocaleDateString("en", { month: "short", year: "numeric" }) : "Unavailable from API"} />
            <ProfileField label="Reviews Created" value={stats.totalReviews} />
            <div className="rounded-3xl bg-slate-950 px-5 py-4 text-white">
              <p className="text-sm text-slate-300">Need a broader overview?</p>
              <Button variant="outline" className="mt-4 h-10 rounded-full border-white/20 bg-white/5 px-4 text-white hover:bg-white hover:text-slate-950" onClick={() => navigate("/reviews")}>
                <BookOpen className="h-4 w-4" />
                Manage reviews
              </Button>
            </div>
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="Recent Reviews" description="Latest activity from your review history.">
        {loading ? (
          <div className="py-8 text-center text-sm text-slate-500">Loading recent reviews...</div>
        ) : recentReviews.length === 0 ? (
          <EmptyState
            title="No reviews yet"
            description="Create your first review to see it appear here and in the statistics above."
            actionLabel="Create Review"
            onAction={() => navigate("/reviews/new")}
          />
        ) : (
          <div className="grid gap-4">
            {recentReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                showActions={false}
              />
            ))}
          </div>
        )}
      </DashboardCard>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
      <span className="font-medium text-slate-600">{label}</span>
      <span className="font-semibold text-slate-950">{value}</span>
    </div>
  );
}

export default Dashboard;