import { useEffect, useState } from "react";
import { LogOut, Save, LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { updateProfile } from "@/services/profileService";
import { useToast } from "@/hooks/useToast";
import { ProfileSkeleton } from "@/components/common/Skeleton";

function Settings() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { profile, loading, refreshProfile } = useProfile();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    language: "en-US",
    country: "Pakistan",
    timezone: "Asia/Karachi",
    adult_content: false,
    filter_profanity: true,
    keyboard_shortcuts: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        language: profile.language ?? "en-US",
        country: profile.country ?? "Pakistan",
        timezone: profile.timezone ?? "Asia/Karachi",
        adult_content: profile.adult_content ?? false,
        filter_profanity: profile.filter_profanity ?? true,
        keyboard_shortcuts: profile.keyboard_shortcuts ?? true,
      });
    }
  }, [profile]);

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  async function handleSave(event) {
    event.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({ settings: formData });
      await refreshProfile();
      showToast({ tone: "success", title: "Settings saved", description: "Your preferences have been updated." });
    } catch {
      showToast({ tone: "error", title: "Save failed", description: "Could not save your preferences." });
    } finally {
      setIsSaving(false);
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  if (loading || !profile) return <ProfileSkeleton />;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="page-title mb-1">Account Settings</h1>
        <p className="body-text">
          Manage how ReviewLog works for you.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Language & Region */}
        <section className="surface-card p-6 md:p-8">
          <h2 className="section-title text-xl mb-6">Language & Region</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold mb-1 text-foreground">Default Language</label>
              <select name="language" value={formData.language} onChange={handleChange} className="field appearance-none cursor-pointer">
                <option value="en-US">English (en-US)</option>
                <option value="en-UK">English (en-UK)</option>
                <option value="fr-FR">French (fr-FR)</option>
                <option value="es-ES">Spanish (es-ES)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-foreground">Country</label>
              <select name="country" value={formData.country} onChange={handleChange} className="field appearance-none cursor-pointer">
                <option value="Pakistan">Pakistan</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-foreground">Timezone</label>
              <select name="timezone" value={formData.timezone} onChange={handleChange} className="field appearance-none cursor-pointer">
                <option value="Asia/Karachi">Asia/Karachi</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Auto-detect">Auto-detect</option>
              </select>
            </div>
          </div>
        </section>

        {/* Content Preferences */}
        <section className="surface-card p-6 md:p-8">
          <h2 className="section-title text-xl mb-6">Content Preferences</h2>
          <div className="space-y-6 max-w-lg">
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input type="checkbox" name="adult_content" checked={formData.adult_content} onChange={handleChange} className="sr-only peer" />
                <div className="w-10 h-6 bg-muted rounded-full peer-checked:bg-primary transition-colors border border-border" />
                <div className="absolute left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm" />
              </div>
              <div>
                <span className="block text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Display Adult Content</span>
                <span className="block text-xs text-muted-foreground mt-0.5">Allow 18+ content in your discovery searches and feeds.</span>
              </div>
            </label>

            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input type="checkbox" name="filter_profanity" checked={formData.filter_profanity} onChange={handleChange} className="sr-only peer" />
                <div className="w-10 h-6 bg-muted rounded-full peer-checked:bg-primary transition-colors border border-border" />
                <div className="absolute left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm" />
              </div>
              <div>
                <span className="block text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Filter Profanity</span>
                <span className="block text-xs text-muted-foreground mt-0.5">Automatically censor severe profanity in public reviews.</span>
              </div>
            </label>
          </div>
        </section>

        {/* Accessibility & Experience */}
        <section className="surface-card p-6 md:p-8">
          <h2 className="section-title text-xl mb-6">Accessibility & Experience</h2>
          <div className="space-y-6 max-w-lg">
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-0.5">
                <input type="checkbox" name="keyboard_shortcuts" checked={formData.keyboard_shortcuts} onChange={handleChange} className="sr-only peer" />
                <div className="w-10 h-6 bg-muted rounded-full peer-checked:bg-primary transition-colors border border-border" />
                <div className="absolute left-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm" />
              </div>
              <div>
                <span className="block text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Enable Keyboard Shortcuts</span>
                <span className="block text-xs text-muted-foreground mt-0.5">Allow quick-navigation keystrokes across the application.</span>
              </div>
            </label>
          </div>
        </section>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
          <button type="button" onClick={handleLogout} className="btn btn-outline text-destructive hover:bg-destructive/10 border-destructive/20 h-10 px-6 sm:mr-auto order-2 sm:order-1">
            <LogOut className="h-4 w-4 mr-1.5" /> Logout
          </button>
          <button type="submit" disabled={isSaving} className="btn btn-primary h-10 px-8 order-1 sm:order-2">
            {isSaving ? <LoaderCircle className="h-4 w-4 animate-spin mr-1.5" /> : <Save className="h-4 w-4 mr-1.5" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;