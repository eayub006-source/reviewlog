import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "@/components/common/DashboardCard";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { getFavorites, removeFavorite } from "@/services/favoriteService";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  useEffect(() => { getFavorites().then(setFavorites).catch(() => setFavorites([])); }, []);
  async function remove(id) { await removeFavorite(id); setFavorites((items) => items.filter((item) => item.id !== id)); }
  return <DashboardCard title="Favorites" description="Books and movies saved to revisit or review later.">
    {favorites.length === 0 ? <EmptyState icon={Heart} title="No favorites yet" description="Save an item while browsing books or movies." /> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{favorites.map((item) => <article key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4"><div className="flex gap-3"><div className="h-20 w-14 overflow-hidden rounded-xl bg-slate-200">{item.image ? <img src={item.image} alt="" className="h-full w-full object-cover" loading="lazy" /> : null}</div><div className="min-w-0 flex-1"><p className="text-xs font-medium uppercase text-slate-500">{item.item_type}</p><h3 className="font-semibold text-slate-950">{item.title}</h3><div className="mt-3 flex gap-2"><Button size="sm" onClick={() => navigate(`/reviews/new?item=${encodeURIComponent(JSON.stringify({ type: item.item_type, id: item.item_id, source: item.external_source, title: item.title, image: item.image, metadata: item.metadata }))}`)}>Review</Button><Button size="sm" variant="outline" onClick={() => remove(item.id)}>Remove</Button></div></div></div></article>)}</div>}
  </DashboardCard>;
}
export default Favorites;
