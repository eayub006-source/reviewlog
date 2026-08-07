import { Ban } from "lucide-react";

import ErrorPage from "@/pages/errors/ErrorPage";

function Forbidden() {
  return (
    <ErrorPage
      code="403"
      title="Access denied"
      description="You do not have permission to view this page or perform this action."
      icon={Ban}
    />
  );
}

export default Forbidden;
