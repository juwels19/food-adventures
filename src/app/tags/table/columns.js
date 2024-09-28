"use client";

import DeleteTagModal from "@/components/common/modals/delete-tag";
import EditTagModal from "@/components/common/modals/edit-tag";

export const tagTableColumns = [
  {
    accessorKey: "name",
    header: () => <div className="text-lg font-semibold">Name</div>,
  },
  {
    accessorKey: "backgroundColour",
    header: () => <div className="text-lg font-semibold">Colour</div>,
  },
  {
    accessorKey: "_count.restaurants",
    header: () => <div className="text-lg font-semibold">Usage Count</div>,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const tag = row.original;

      return (
        <div className="flex flex-row gap-2 justify-end">
          <EditTagModal tag={tag} />
          <DeleteTagModal tag={tag} disabled={tag._count.restaurants !== 0} />
        </div>
      );
    },
  },
];
