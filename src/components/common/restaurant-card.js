import React from "react";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";

import { getTagsByIds } from "@/db/queries";
import ROUTES from "@/lib/routes";

import { Star, Utensils, MapPinIcon, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "../ui/badge";

export default async function RestaurantCard({ restaurant }) {
  const tags = (await getTagsByIds(restaurant.tags)).map((tag) => ({
    ...tag,
    label: tag.name,
    value: tag.name,
  }));

  return (
    <div className="relative">
      <Link href={`${ROUTES.VIEW_RESTAURANT_BASE}/${restaurant.id}`}>
        <Card className="w-full h-full sm:max-md:max-w-sm rounded-lg overflow-hidden hover:shadow-lg cursor-pointer transition-shadow">
          {restaurant?.imageUrl && (
            <Image
              src={restaurant.imageUrl}
              height={200}
              width={300}
              className="w-full h-36 md:h-64 object-cover"
              alt={`picture of ${restaurant.name}`}
            />
          )}
          <CardContent className="flex flex-col pt-4 gap-2">
            <div className="flex flex-row justify-between items-center">
              <CardTitle>{restaurant?.name}</CardTitle>
              {restaurant?.rating && (
                <div className="flex flex-row gap-2 items-center">
                  <Star size={20} color="gold" fill="gold" />
                  <p className="text-lg">{restaurant.rating} / 10</p>
                </div>
              )}
            </div>
            {restaurant?.comments && (
              <CardDescription className="text-md leading-tight">
                {restaurant.comments}
              </CardDescription>
            )}
            {tags?.length > 0 && (
              <div className="flex flex-row gap-2">
                <Utensils size={20} />
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    className={`bg-[${tag.backgroundColour}]`}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex flex-row gap-2 items-center justify-start">
              <MapPinIcon size={22} />
              <span className="truncate">{restaurant.address}</span>
            </div>
            {restaurant?.dateVisited && (
              <div className="flex flex-row gap-2 items-center">
                <Calendar size={20} />
                {`Visited on ${dayjs(restaurant.dateVisited).format(
                  "dddd MMMM D, YYYY"
                )}`}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
