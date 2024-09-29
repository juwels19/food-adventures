"use client";

import DeleteTagModal from "@/components/common/modals/delete-tag";
import EditTagModal from "@/components/common/modals/edit-tag";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const tagTableColumns = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-lg font-semibold p-0 hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <span className="font-semibold">{row.original.name}</span>;
    },
  },
  {
    accessorKey: "backgroundColour",
    header: () => <div className="text-lg font-semibold">Colour</div>,
    cell: ({ row }) => {
      return (
        <div
          className="rounded-md text-white text-center p-1 max-w-[100px]"
          style={{ backgroundColor: row.original.backgroundColour }}
        >
          {row.original.backgroundColour}
        </div>
      );
    },
  },
  {
    accessorKey: "_count.restaurants",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-lg font-semibold p-0 hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Usage count
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const tag = row.original;

      return (
        <div className="flex flex-row gap-2 justify-end">
          <EditTagModal tag={tag} />
          <DeleteTagModal tag={tag} />
        </div>
      );
    },
  },
];
