import { useState } from "react";
import { Mail, CalendarDays, Pencil, Save, X, Image as ImageIcon } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useReviews } from "@/hooks/useReviews";
import { updateProfile } from "@/services/profileService";
import { useToast } from "@/hooks/useToast";
import { ProfileSkeleton } from "@/components/common/Skeleton";
import Avatar from "@/components/ui/avatar";

function Profile() {
  const { profile, loading, refreshProfile } = useProfile();
  const { reviews } = useReviews({ scope: "mine" });
  const { showToast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({});

  if (loading || !profile) return <ProfileSkeleton />;

  const memberSince = profile?.date_joined
    ? new Date(profile.date_joined).toLocaleDateString("en", {
        month: "long",
        year: "numeric",
      })
    : "Unavailable";

  // Calculate rating distribution
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    if (r.rating && distribution[r.rating] !== undefined) {
      distribution[r.rating]++;
    }
  });
  const maxCount = Math.max(...Object.values(distribution), 1);

  const handleEditToggle = () => {
    if (!isEditing) {
      setFormData({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        bio: profile.bio || "",
        avatar_data: profile.avatar_data || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast({ tone: "error", title: "File too large", description: "Avatar must be under 2MB." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar_data: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      await refreshProfile();
      setIsEditing(false);
      showToast({ tone: "success", title: "Profile updated", description: "Your details have been saved." });
    } catch {
      showToast({ tone: "error", title: "Update failed", description: "Could not save profile details." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="surface-panel overflow-hidden">
        <div className="h-32 bg-[radial-gradient(ellipse_at_top_left,_#e07a5f_0%,_#2d5a27_100%)] opacity-80" />
        
        <div className="px-6 md:px-10 pb-8 relative">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end -mt-12 sm:-mt-16 mb-4">
            <div className="relative group">
              {isEditing ? (
                <div className="relative h-28 w-28 rounded-full border-4 border-card bg-muted flex items-center justify-center overflow-hidden cursor-pointer">
                  {formData.avatar_data ? (
                    <img src={formData.avatar_data} alt="Avatar Preview" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-bold">Change</span>
                  </div>
                  <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                </div>
              ) : (
                profile.avatar_data ? (
                  <img src={profile.avatar_data} alt={profile.username} className="h-28 w-28 rounded-full border-4 border-card object-cover bg-muted" />
                ) : (
                  <Avatar name={profile.username} className="h-28 w-28 rounded-full border-4 border-card bg-primary text-primary-foreground text-3xl font-bold" />
                )
              )}
            </div>
            
            <div className="flex-1 pb-2">
              <h1 className="font-heading text-3xl font-bold text-foreground">
                {profile.first_name || profile.last_name 
                  ? `${profile.first_name} ${profile.last_name}`.trim() 
                  : profile.username}
              </h1>
              <p className="text-muted-foreground mt-1">@{profile.username}</p>
            </div>

            <div className="pb-2 flex gap-2">
              {isEditing ? (
                <>
                  <button onClick={handleEditToggle} className="btn btn-ghost px-4 h-9">
                    <X className="h-4 w-4 mr-1.5" /> Cancel
                  </button>
                  <button onClick={handleSave} disabled={isSaving} className="btn btn-primary px-4 h-9">
                    <Save className="h-4 w-4 mr-1.5" /> {isSaving ? "Saving..." : "Save"}
                  </button>
                </>
              ) : (
                <button onClick={handleEditToggle} className="btn btn-outline px-4 h-9">
                  <Pencil className="h-4 w-4 mr-1.5" /> Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Edit Form or Bio Display */}
          <div className="mt-6 border-t border-border pt-6">
            {isEditing ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold mb-1">First Name</label>
                  <input 
                    type="text" 
                    className="field" 
                    value={formData.first_name} 
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Last Name</label>
                  <input 
                    type="text" 
                    className="field" 
                    value={formData.last_name} 
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})} 
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold mb-1">Bio / About Me</label>
                  <textarea 
                    className="field min-h-[100px] resize-y" 
                    value={formData.bio} 
                    onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                    placeholder="Write a short bio about your reading and watching habits..."
                  />
                </div>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">About Me</h3>
                    <p className="body-text whitespace-pre-wrap">
                      {profile.bio || "This user hasn't written a bio yet."}
                    </p>
                  </div>
                </div>
                <div className="space-y-3 bg-muted/50 p-4 rounded-xl border border-border">
                  <div className="flex items-center gap-3 text-sm text-foreground">
                    <Mail className="h-4 w-4 text-muted-foreground" /> {profile.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" /> Member since {memberSince}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Activity & Histogram */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="surface-card p-6 md:p-8">
          <h2 className="card-title mb-6">Activity Snapshot</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted p-4 rounded-xl border border-border text-center">
              <span className="block text-3xl font-heading font-bold text-foreground">{reviews.length}</span>
              <span className="block text-xs uppercase tracking-wider font-bold text-muted-foreground mt-1">Total Reviews</span>
            </div>
            <div className="bg-muted p-4 rounded-xl border border-border text-center">
              <span className="block text-3xl font-heading font-bold text-foreground">
                {reviews.filter(r => r.item_type === "movie").length}
              </span>
              <span className="block text-xs uppercase tracking-wider font-bold text-muted-foreground mt-1">Films</span>
            </div>
            <div className="bg-muted p-4 rounded-xl border border-border text-center">
              <span className="block text-3xl font-heading font-bold text-foreground">
                {reviews.filter(r => r.item_type === "book").length}
              </span>
              <span className="block text-xs uppercase tracking-wider font-bold text-muted-foreground mt-1">Books</span>
            </div>
            <div className="bg-muted p-4 rounded-xl border border-border text-center">
              <span className="block text-3xl font-heading font-bold text-foreground">
                {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0"}
              </span>
              <span className="block text-xs uppercase tracking-wider font-bold text-muted-foreground mt-1">Avg Rating</span>
            </div>
          </div>
        </div>

        <div className="surface-card p-6 md:p-8 flex flex-col">
          <h2 className="card-title mb-6">Rating Distribution</h2>
          <div className="flex-1 flex flex-col justify-end gap-3 mt-4">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = distribution[star];
              const percentage = (count / maxCount) * 100;
              return (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="font-bold text-muted-foreground w-12 text-right">{star} star</span>
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-secondary rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="font-medium text-foreground w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;