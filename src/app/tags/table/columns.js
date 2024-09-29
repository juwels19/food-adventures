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
    header: () => <div className="text-lg font-semibold">Usage Count</div>,
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
