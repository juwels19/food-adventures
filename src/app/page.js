import Link from "next/link";
import ROUTES from "@/lib/routes";
import RestaurantCard from "@/components/common/restaurant-card";
import {
  getAllRestaurants,
  getAllVisitedRestaurants,
  getNonVisitedRestaurants,
  getRestaurantTags,
} from "@/db/queries";
import RestaurantsMap from "@/components/maps/restaurants-maps";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import PageSubHeading from "@/components/common/page-subheading";
import { Plus } from "lucide-react";

export default async function Home() {
  const allRestaurants = await getAllRestaurants();
  const restaurantTags = await getRestaurantTags();
  const visitedRestaurants = allRestaurants.filter(
    (restaurant) => restaurant.visited
  );
  const nonVisitedRestaurants = allRestaurants.filter(
    (restaurant) => !restaurant.visited
  );

  return (
    <div className="flex flex-col gap-2 md:gap-4 w-full">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <PageHeader text={`Sabrina and Julian's Food Adventures`} />
        <Link href={ROUTES.NEW_RESTAURANT}>
          <Button className="gap-2 justify-between">
            <Plus size={20} />
            Add new restaurant
          </Button>
        </Link>
      </div>
      <RestaurantsMap restaurants={allRestaurants} />
      <PageSubHeading>{`Places we've been!`}</PageSubHeading>
      <div className="w-full grid grid-cols-1 min-[640px]:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-stretch">
        {visitedRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.name} restaurant={restaurant} />
        ))}
      </div>
      <PageSubHeading>{`Places to visit`}</PageSubHeading>
      <div className="w-full grid grid-cols-1 min-[640px]:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-stretch">
        {nonVisitedRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.name} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}
