import { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
title: string;
value: number;
icon: ReactNode;
description?: string;
}

export function StatsCard({
title,
value,
icon,
description,
}: StatsCardProps) {
return ( <Card> <CardContent className="p-6"> <div className="flex items-center justify-between"> <div> <p className="text-sm font-medium text-muted-foreground">
{title} </p>

        <p className="mt-2 text-3xl font-bold">
          {value}
        </p>

        {description && (
          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <div className="text-muted-foreground">
        {icon}
      </div>
    </div>
  </CardContent>
</Card>

);
}
