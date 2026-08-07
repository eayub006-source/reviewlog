import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Loader from "@/components/common/Loader";

const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Profile = lazy(() => import("@/pages/profile/Profile"));
const Reviews = lazy(() => import("@/pages/reviews/Reviews"));
const ReviewForm = lazy(() => import("@/pages/reviews/ReviewForm"));
const PublicReviews = lazy(() => import("@/pages/reviews/PublicReviews"));
const Settings = lazy(() => import("@/pages/settings/Settings"));
const NotFound = lazy(() => import("@/pages/errors/NotFound"));
const Unauthorized = lazy(() => import("@/pages/errors/Unauthorized"));
const Forbidden = lazy(() => import("@/pages/errors/Forbidden"));
const ServerError = lazy(() => import("@/pages/errors/ServerError"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/reviews/new" element={<ReviewForm />} />
              <Route path="/reviews/:reviewId/edit" element={<ReviewForm />} />
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
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <Loader label="Loading page..." />
    </div>
  );
}

export default App;