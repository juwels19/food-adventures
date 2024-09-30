"use client";

import useSWR from "swr";
import RestaurantCard from "./restaurant-card";
import TagFilterInput from "./tags/tag-filter-input";
import { fetcher } from "@/lib/utils";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function FilterableCardLayout({ isVisited = false }) {
  const [filteredItems, setFilteredItems] = useState([]);
  const { data: restaurants, isLoading } = useSWR(
    `/api/restaurants/${isVisited ? "visited" : "not-visited"}${
      filteredItems.length > 0
        ? `?tagIds=${JSON.stringify(filteredItems.map((item) => item.id))}`
        : ""
    }`,
    fetcher,
    {
      shouldRetryOnError: false,
      revalidateOnFocus: false,
    }
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      <TagFilterInput onFilterChange={setFilteredItems} isLoading={isLoading} />
      {isLoading && (
        <div className="p-2 self-center flex flex-row gap-2 items-center">
          <Loader2 className="animate-spin size-8" />
          <span className="text-xl">Loading results...</span>
        </div>
      )}
      {!isLoading && restaurants && (
        <div className="w-full grid grid-cols-1 min-[640px]:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-stretch">
          {restaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.name} restaurant={restaurant} />
          ))}
        </div>
      )}
    </div>
  );
}
