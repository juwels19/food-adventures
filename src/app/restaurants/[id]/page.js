import { getRestaurant } from "@/db/queries";
import ROUTES from "@/lib/routes";

import PageHeader from "@/components/common/page-header";

export default async function RestaurantPage({ params }) {
  const restaurantId = params.id;

  const restaurant = await getRestaurant(restaurantId);

  return (
    <div className="flex flex-col gap-2 md:gap-6 w-full">
      <PageHeader backButtonHref={ROUTES.HOME} text={restaurant.name} />
    </div>
  );
}
