import PageHeader from "@/components/common/page-header";
import NewRestaurantForm from "@/components/forms/restaurant/new";
import ROUTES from "@/lib/routes";

export default async function NewRestaurantPage() {
  return (
    <div className="flex flex-col gap-2 md:gap-4 w-full">
      <PageHeader backButtonHref={ROUTES.HOME} text="Add new restaurant" />
      <NewRestaurantForm />
    </div>
  );
}
