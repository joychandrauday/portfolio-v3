import React from "react";
import { FolderArchive } from "lucide-react";

interface FolderItemProps {
  id: string;
  name: string;
  color: string;
  count: number;
  selected: boolean;
  onSelect: (id: string) => void;
}

const FolderItem: React.FC<FolderItemProps> = ({ id, name, color, count, selected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(id)}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-colors cursor-pointer ${selected ? "bg-accent/15 border-accent text-accent font-bold border" : "bg-bg-surface border-border text-text-muted hover:text-text-primary"}`}
    >
      <div className="flex items-center gap-2 truncate">
        <FolderArchive className="w-3.5 h-3.5 text-accent" />
        <span>{name}</span>
      </div>
      <span className="text-[10px] opacity-60">({count})</span>
    </button>
  );
};

export default React.memo(FolderItem);
