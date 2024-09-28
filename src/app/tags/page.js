import PageHeader from "@/components/common/page-header";
import { getAllTags, getAllTagsWithRelations } from "@/db/queries";
import ROUTES from "@/lib/routes";
import TagTable from "./table";
import { tagTableColumns } from "./table/columns";

export default async function ManageTagsPage() {
  const tags = await getAllTagsWithRelations();

  return (
    <div className="flex flex-col gap-2 md:gap-4 w-full">
      <PageHeader backButtonHref={ROUTES.HOME} text="Manage Tags" />
      <TagTable data={tags} columns={tagTableColumns} />
    </div>
  );
}
