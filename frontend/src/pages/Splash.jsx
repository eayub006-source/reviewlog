import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoaderCircle } from "lucide-react";

function Splash() {
  const navigate = useNavigate();
  const { isAuthenticated, isInitializing } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setMounted(true);
  }, []);

  function handleEnter() {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background">
      {/* Soft yellow/cream radial sunburst */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-40">
        <div className="h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle_at_center,_#fcf3d9_0%,_transparent_70%)] blur-3xl"></div>
      </div>
      
      {/* Subtle botanical/leaf decoration (SVG) */}
      <div className="absolute -left-10 top-10 z-0 opacity-20 transform -rotate-12">
        <svg width="120" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C12 22 4 16 4 10C4 6 7 2 12 2C17 2 20 6 20 10C20 16 12 22 12 22Z" fill="#2d5a27"/>
        </svg>
      </div>
      <div className="absolute -right-10 bottom-10 z-0 opacity-20 transform rotate-12">
        <svg width="150" height="180" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22C12 22 4 16 4 10C4 6 7 2 12 2C17 2 20 6 20 10C20 16 12 22 12 22Z" fill="#2d5a27"/>
        </svg>
      </div>

      <div className={`z-10 flex flex-col items-center text-center transition-all duration-1000 ease-out transform ${mounted ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
        <h1 className="font-heading text-5xl md:text-7xl font-bold text-primary mb-4 tracking-tight">
          ReviewLog
        </h1>
        <p className="font-sans text-lg md:text-xl text-muted-foreground mb-12 max-w-md px-6 leading-relaxed">
          A private cinematic & literary journal. Keep track of the stories you love.
        </p>

        <button
          onClick={handleEnter}
          disabled={isInitializing}
          className="btn btn-primary rounded-full px-8 py-4 text-base font-semibold tracking-wide shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
        >
          {isInitializing ? (
            <LoaderCircle className="h-5 w-5 animate-spin" />
          ) : (
            <>
              Enter your vault
              <span className="transform transition-transform group-hover:translate-x-1">→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Splash;