import RestaurantCard from "@/components/common/restaurant-card";
import AddRestaurantForm from "@/components/forms/add-restaurant-form";
import {
  getAllRestaurants,
  getAllVisitedRestaurants,
  getNonVisitedRestaurants,
} from "@/db/queries";
import RestaurantsMap from "@/components/maps/restaurants-maps";

export default async function Home() {
  const allRestaurants = await getAllRestaurants();
  const visitedRestaurants = allRestaurants.filter(
    (restaurant) => restaurant.visited
  );
  const nonVisitedRestaurants = allRestaurants.filter(
    (restaurant) => !restaurant.visited
  );

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h1>Sabrina and Julian&apos;s Food Adventures</h1>
        <AddRestaurantForm />
      </div>
      <RestaurantsMap restaurants={allRestaurants} />
      <h2>Places we&apos;ve been!</h2>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
        {visitedRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.name} restaurant={restaurant} />
        ))}
      </div>
      <h2>Places we still need to try</h2>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
        {nonVisitedRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.name} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}
