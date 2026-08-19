import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Loader from "@/components/common/Loader";
import Splash from "@/pages/Splash";

const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/auth/ResetPassword"));
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Discover = lazy(() => import("@/pages/discover/Discover"));
const Profile = lazy(() => import("@/pages/profile/Profile"));
const Reviews = lazy(() => import("@/pages/reviews/Reviews"));
const ReviewForm = lazy(() => import("@/pages/reviews/ReviewForm"));
const PublicReviews = lazy(() => import("@/pages/reviews/PublicReviews"));
const Settings = lazy(() => import("@/pages/settings/Settings"));
const BookSearchPage = lazy(() => import("@/pages/books/BookSearchPage"));
const MovieSearchPage = lazy(() => import("@/pages/movies/MovieSearchPage"));
const Favorites = lazy(() => import("@/pages/favorites/Favorites"));
const NotFound = lazy(() => import("@/pages/errors/NotFound"));
const Unauthorized = lazy(() => import("@/pages/errors/Unauthorized"));
const Forbidden = lazy(() => import("@/pages/errors/Forbidden"));
const ServerError = lazy(() => import("@/pages/errors/ServerError"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Splash />} />

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/reviews/new" element={<ReviewForm />} />
              <Route path="/reviews/:reviewId/edit" element={<ReviewForm />} />
              <Route path="/books" element={<BookSearchPage />} />
              <Route path="/movies" element={<MovieSearchPage />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/public-reviews" element={<PublicReviews />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="/server-error" element={<ServerError />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader label="Loading..." />
    </div>
  );
}

export default App;
