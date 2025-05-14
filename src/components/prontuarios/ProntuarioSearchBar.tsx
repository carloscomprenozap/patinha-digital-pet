
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ProntuarioSearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ProntuarioSearchBar = ({ searchTerm, setSearchTerm }: ProntuarioSearchBarProps) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
      <Input
        placeholder="Buscar prontuários por pet, veterinário ou diagnóstico..."
        className="pl-10"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default ProntuarioSearchBar;
