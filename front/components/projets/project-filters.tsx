"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { StatutProjet } from "@/types/projet";

interface ProjectFiltersProps {
  search: string;

  statut: StatutProjet | "TOUS";

  onSearchChange: (
    value: string,
  ) => void;

  onStatutChange: (
    value: StatutProjet | "TOUS",
  ) => void;
}

export function ProjectFilters({
  search,
  statut,
  onSearchChange,
  onStatutChange,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Rechercher un projet..."
          className="pl-9"
        />
      </div>

      <Select
        value={statut}
        onValueChange={(value) =>
          onStatutChange(
            value as StatutProjet | "TOUS",
          )
        }
      >
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Statut" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="TOUS">
            Tous les statuts
          </SelectItem>

          <SelectItem value="PLANIFIE">
            Planifiés
          </SelectItem>

          <SelectItem value="EN_COURS">
            En cours
          </SelectItem>

          <SelectItem value="TERMINE">
            Terminés
          </SelectItem>

          <SelectItem value="ARCHIVE">
            Archivés
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}