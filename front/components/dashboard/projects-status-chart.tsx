"use client";

import {
Bar,
BarChart,
CartesianGrid,
XAxis,
YAxis,
ResponsiveContainer,
Tooltip,
} from "recharts";

import {
Card,
CardContent,
CardHeader,
CardTitle,
} from "@/components/ui/card";

import { ProjetParStatut } from "@/types/dashboard";

interface ProjectsStatusChartProps {
data: ProjetParStatut[];
}

const labels: Record<string, string> = {
PLANIFIE: "Planifiés",
EN_COURS: "En cours",
TERMINE: "Terminés",
ARCHIVE: "Archivés",
};

export function ProjectsStatusChart({
data,
}: ProjectsStatusChartProps) {
const chartData = data.map((item) => ({
statut: labels[item.statut] ?? item.statut,
nombre: item.nombre,
}));

return (
<Card>
<CardHeader>
<CardTitle>
Répartition des projets
</CardTitle>
</CardHeader>

  <CardContent>
    <div className="h-[300px]">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis dataKey="statut" />

          <YAxis
            allowDecimals={false}
          />

          <Tooltip />

          <Bar
            dataKey="nombre"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>

);
}