import { MoreHorizontal, Pencil, Trash2, type LucideIcon } from "lucide-react";

import type { DataTableColumn } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type RowActionsOptions<T> = {
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  editLabel?: string;
  deleteLabel?: string;
  editIcon?: LucideIcon;
  deleteIcon?: LucideIcon;
};

export function createRowActionsColumn<T>({
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
  editIcon: EditIcon = Pencil,
  deleteIcon: DeleteIcon = Trash2,
}: RowActionsOptions<T>): DataTableColumn<T> {
  return {
    id: "actions",
    header: "",
    align: "right",
    cell: (row) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" aria-label="Row actions" onClick={(e) => e.stopPropagation()}>
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          {onEdit && (
            <DropdownMenuItem onClick={() => onEdit(row)}>
              <EditIcon className="size-4" />
              {editLabel}
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem variant="destructive" onClick={() => onDelete(row)}>
              <DeleteIcon className="size-4" />
              {deleteLabel}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  };
}