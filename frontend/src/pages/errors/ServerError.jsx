import { ServerCrash } from "lucide-react";

import ErrorPage from "@/pages/errors/ErrorPage";

function ServerError() {
  return (
    <ErrorPage
      code="500"
      title="Server error"
      description="Something went wrong on the server. Please try again in a moment."
      icon={ServerCrash}
      primaryAction={{ label: "Retry", onClick: () => window.location.reload() }}
    />
  );
}

export default ServerError;
