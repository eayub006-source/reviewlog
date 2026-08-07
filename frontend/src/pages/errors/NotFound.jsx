import { SearchX } from "lucide-react";

import ErrorPage from "@/pages/errors/ErrorPage";

function NotFound() {
  return (
    <ErrorPage
      code="404"
      title="Page not found"
      description="The page you are looking for does not exist or was moved."
      icon={SearchX}
    />
  );
}

export default NotFound;
