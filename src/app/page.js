import AddRestaurantForm from "@/components/forms/add-restaurant-form";
import { getAllRestaurants } from "@/db/queries";

export default async function Home() {
  // const restaurants = await getAllRestaurants();

  return (
    <div className="flex flex-col gap-8">
      <h1>Welcome to Food Adventures</h1>
      <AddRestaurantForm />
    </div>
  );
}
