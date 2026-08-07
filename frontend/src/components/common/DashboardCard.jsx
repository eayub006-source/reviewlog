import { memo } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardCard = memo(function DashboardCard({ title, description, children, className = "" }) {
  return (
    <Card className={className ? `${className} surface-panel` : "surface-panel"}>
      <CardHeader className="px-6 pt-6">
        <CardDescription className="caption-text">{description}</CardDescription>
        <CardTitle className="card-title mt-1">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-4">{children}</CardContent>
    </Card>
  );
});

export default DashboardCard;
