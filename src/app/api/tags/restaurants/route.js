import { getRestaurantTags } from "@/db/queries";

export const dynamic = "force-dynamic";
export async function GET() {
  const restaurantTags = await getRestaurantTags();
  return Response.json(restaurantTags, { status: 200 });
}
