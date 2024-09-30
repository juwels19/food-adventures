import { getAllNonVisitedRestaurants } from "@/db/queries";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const tagIds = JSON.parse(searchParams.get("tagIds"));
  const restaurants = await getAllNonVisitedRestaurants(tagIds);
  return Response.json(restaurants, { status: 200 });
}
