import { ArrowRight, BookOpen, Globe2, PlusCircle, User, Film, Heart } from "lucide-react";
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
import { getFavorites, getRecentItems } from "@/services/favoriteService";
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { reviews, loading } = useReviews({ scope: "mine" });
  const [catalog, setCatalog] = useState({ favorites: 0, recent: [] });
  useEffect(() => { Promise.all([getFavorites(), getRecentItems()]).then(([favorites, recent]) => setCatalog({ favorites: favorites.length, recent: recent.slice(0, 4) })).catch(() => undefined); }, []);

  const stats = useMemo(() => {
    const totalReviews = reviews.length;
    const publicReviews = reviews.filter((review) => review.is_public).length;
    const booksReviewed = reviews.filter((review) => review.item_type === "book").length;
    const moviesReviewed = reviews.filter((review) => review.item_type === "movie").length;

    return {
      totalReviews,
      publicReviews,
      booksReviewed,
      moviesReviewed,
    };
  }, [reviews]);

  const recentReviews = useMemo(() => [...reviews].sort((left, right) => new Date(right.date) - new Date(left.date)).slice(0, 3), [reviews]);

  if (!profile || loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <DashboardCard title={`Welcome, ${profile?.username ?? "Reviewer"}`} description="Your ReviewLog dashboard overview.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatsCard title="Reviews Created" value={stats.totalReviews} icon={BookOpen} />
          <StatsCard title="Books Reviewed" value={stats.booksReviewed} icon={BookOpen} tone="accent" />
          <StatsCard title="Movies Reviewed" value={stats.moviesReviewed} icon={Film} tone="subtle" />
          <StatsCard title="Favorites" value={catalog.favorites} icon={Heart} />
          <StatsCard title="Public Reviews" value={stats.publicReviews} icon={Globe2} tone="accent" />
        </div>
      </DashboardCard>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <DashboardCard title="Quick Actions" description="Jump to the most common review tasks.">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { title: "Create Review", description: "Start a new review entry.", icon: PlusCircle, action: () => navigate("/reviews/new") },
              { title: "My Reviews", description: "Review and manage your entries.", icon: BookOpen, action: () => navigate("/reviews") },
              { title: "Find Books", description: "Search Open Library.", icon: BookOpen, action: () => navigate("/books") },
              { title: "Find Movies", description: "Search TMDB.", icon: Film, action: () => navigate("/movies") },
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

      <DashboardCard title="Latest Activity" description="Your most recent review activity.">
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

      {catalog.recent.length ? <DashboardCard title="Recently Viewed" description="External items you opened most recently."><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{catalog.recent.map((item) => <button key={item.id} type="button" onClick={() => navigate(`/reviews/new?item=${encodeURIComponent(JSON.stringify({ type: item.item_type, id: item.item_id, source: item.external_source, title: item.title, image: item.image, metadata: item.metadata }))}`)} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left hover:bg-white"><div className="h-12 w-9 overflow-hidden rounded bg-slate-200">{item.image ? <img src={item.image} alt="" className="h-full w-full object-cover" /> : null}</div><div className="min-w-0"><p className="truncate text-sm font-semibold">{item.title}</p><p className="text-xs text-slate-500">{item.item_type}</p></div></button>)}</div></DashboardCard> : null}
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
