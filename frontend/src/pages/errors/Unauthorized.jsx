import { ShieldAlert } from "lucide-react";

import ErrorPage from "@/pages/errors/ErrorPage";

function Unauthorized() {
  return (
    <ErrorPage
      code="401"
      title="Session expired"
      description="Your session is no longer valid. Please sign in again to continue."
      icon={ShieldAlert}
      primaryAction={{ label: "Go to login", to: "/login" }}
    />
  );
}

export default Unauthorized;
