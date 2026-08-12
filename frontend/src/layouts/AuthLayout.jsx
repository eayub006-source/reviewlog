import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Editorial Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute -left-[200px] top-[10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,_#e07a5f_0%,_transparent_60%)] blur-3xl mix-blend-multiply" />
        <div className="absolute right-[5%] top-[20%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,_#2d5a27_0%,_transparent_60%)] blur-3xl mix-blend-multiply opacity-20" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        {/* Left Side: Brand Story */}
        <section className="mb-12 hidden max-w-xl lg:block lg:pr-12">
          <div className="mb-8">
            <h1 className="font-heading text-5xl font-bold tracking-tight text-primary">
              ReviewLog
            </h1>
          </div>
          <h2 className="font-heading max-w-2xl text-4xl leading-tight text-foreground xl:text-5xl font-bold">
            Your private library is waiting.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground font-sans">
            A warm, personal space to log the films you've watched and the books you've read. Discover new stories, write your thoughts, and build your collection.
          </p>
          
          {/* Subtle Decorative Imagery */}
          <div className="mt-12 flex items-center gap-6 opacity-80">
            <div className="h-32 w-24 rounded-lg bg-muted border border-border shadow-sm rotate-[-6deg] flex items-center justify-center overflow-hidden">
               <div className="w-full h-full bg-[#3d3d3d]"></div>
            </div>
            <div className="h-36 w-28 rounded-lg bg-muted border border-border shadow-sm z-10 flex items-center justify-center overflow-hidden">
               <div className="w-full h-full bg-[#8a837c]"></div>
            </div>
            <div className="h-32 w-24 rounded-lg bg-muted border border-border shadow-sm rotate-[6deg] flex items-center justify-center overflow-hidden">
               <div className="w-full h-full bg-[#c96c53]"></div>
            </div>
          </div>
        </section>
        
        {/* Right Side: Auth Form */}
        <section className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md relative">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthLayout;
