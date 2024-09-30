import Link from "next/link";
import ROUTES from "@/lib/routes";
import { getAllRestaurants } from "@/db/queries";
import RestaurantsMap from "@/components/maps/restaurants-maps";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import PageSubHeading from "@/components/common/page-subheading";
import { Plus, Settings } from "lucide-react";
import FilterableCardLayout from "@/components/common/filterable-card-layout";

export default async function Home() {
  const allRestaurants = await getAllRestaurants();

  return (
    <div className="flex flex-col gap-2 md:gap-4 w-full">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
        <PageHeader text={`Sabrina and Julian's Food Adventures`} />

        <div className="flex flex-row gap-2">
          <Link href={ROUTES.NEW_RESTAURANT}>
            <Button className="gap-2 justify-between">
              <Plus size={20} />
              Add new restaurant
            </Button>
          </Link>
          <Link href={ROUTES.TAGS}>
            <Button className="gap-2 justify-between">
              <Settings size={20} />
              Manage tags
            </Button>
          </Link>
        </div>
      </div>
      <RestaurantsMap restaurants={allRestaurants} />
      <PageSubHeading>{`Places we've been!`}</PageSubHeading>
      <FilterableCardLayout isVisited={true} />
      <PageSubHeading>{`Places to visit`}</PageSubHeading>
      <FilterableCardLayout isVisited={false} />
    </div>
  );
}
