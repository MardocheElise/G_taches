import { Badge } from "@/components/ui/badge";
import { StatutProjet } from "@/types/projet";

interface StatutBadgeProps {
  statut: StatutProjet;
}

const statutLabels: Record<StatutProjet, string> = {
  PLANIFIE: "Planifié",
  EN_COURS: "En cours",
  TERMINE: "Terminé",
  ARCHIVE: "Archivé",
};

const statutClasses: Record<StatutProjet, string> = {
  PLANIFIE:
    "bg-blue-100 text-blue-700 hover:bg-blue-100",

  EN_COURS:
    "bg-orange-100 text-orange-700 hover:bg-orange-100",

  TERMINE:
    "bg-green-100 text-green-700 hover:bg-green-100",

  ARCHIVE:
    "bg-gray-100 text-gray-700 hover:bg-gray-100",
};

export function StatutBadge({
  statut,
}: StatutBadgeProps) {
  return (
    <Badge className={statutClasses[statut]}>
      {statutLabels[statut]}
    </Badge>
  );
}