"use server";
import { revalidatePath } from "next/cache";
import prisma from ".";
import { createTagSchema } from "./schemas";

export const getAllRestaurants = async () => {
  const restaurants = await prisma.restaurants.findMany();
  return restaurants;
};

export const getAllVisitedRestaurants = async () => {
  const restaurants = await prisma.restaurants.findMany({
    where: { visited: { equals: true } },
  });
  return restaurants;
};

export const getNonVisitedRestaurants = async () => {
  const restaurants = await prisma.restaurants.findMany({
    where: { visited: { equals: false } },
  });
  return restaurants;
};

export const createRestaurant = async (restaurantData) => {
  try {
    const newRestaurant = await prisma.restaurants.create({
      data: {
        ...restaurantData,
      },
    });
    revalidatePath("/");
    return newRestaurant;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const updateRestaurant = async (restaurantData, id) => {
  try {
    const updatedRestaurant = await prisma.restaurants.update({
      where: {
        id,
      },
      data: {
        ...restaurantData,
      },
    });
    revalidatePath("/");
    return updatedRestaurant;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getAllThings = async () => {
  const things = await prisma.things.findMany();
  return things;
};

export const getAllTags = async () => {
  const tags = await prisma.tags.findMany();
  return tags;
};

export const getTagsByIds = async (ids) => {
  const tags = await prisma.tags.findMany({ where: { id: { in: ids } } });
  return tags;
};

export const createTag = async (tagData) => {
  const parseResult = createTagSchema.safeParse(tagData);
  if (!parseResult.success) return null;

  try {
    const newTag = await prisma.tags.create({
      data: {
        name: tagData.name,
        type: tagData.type,
        backgroundColour: tagData.backgroundColour,
        fontColour: tagData.fontColour,
      },
    });
    return newTag;
  } catch {
    return null;
  }
};

export const getRestaurantTags = async () => {
  const restaurantTags = await prisma.tags.findMany({
    where: { type: { equals: "restaurant" } },
  });
  return restaurantTags;
};

export const getThingsTags = async () => {
  const thingsTags = await prisma.tags.findMany({
    where: { type: { equals: "things" } },
  });
  return thingsTags;
};
