import ROUTES from "@/lib/routes";
import { getAllTagsWithRelations } from "@/db/queries";
import PageHeader from "@/components/common/page-header";
import NewTagModal from "@/components/common/modals/new-tag";

import TagTable from "./table";
import { tagTableColumns } from "./table/columns";

export default async function ManageTagsPage() {
  const tags = await getAllTagsWithRelations();

  return (
    <div className="flex flex-col gap-2 md:gap-4 w-full">
      <PageHeader backButtonHref={ROUTES.HOME} text="Manage Tags" />
      <div className="justify-self-start">
        <NewTagModal />
      </div>
      <TagTable data={tags} columns={tagTableColumns} />
    </div>
  );
}
