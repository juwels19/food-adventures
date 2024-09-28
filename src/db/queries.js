"use server";
import { revalidatePath } from "next/cache";
import prisma from ".";
import { createTagSchema, editTagSchema } from "./schemas";

export const getAllRestaurants = async () => {
  const restaurants = await prisma.restaurants.findMany({
    include: { tags: true },
  });
  return restaurants;
};

export const getRestaurant = async (id) => {
  const restaurant = await prisma.restaurants.findUnique({
    where: { id },
  });
  return restaurant;
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
        tags: {
          connect: restaurantData.tags.map((tag) => ({ id: tag })),
        },
      },
    });
    revalidatePath("/");
    return newRestaurant;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const updateRestaurant = async (restaurantData, id, path) => {
  try {
    const updatedRestaurant = await prisma.restaurants.update({
      where: {
        id,
      },
      data: {
        ...restaurantData,
        tags: {
          set: [], // first we need to reset the tags
          connect: restaurantData.tags.map((tag) => ({ id: tag })), // then we set the tags here
        },
      },
    });
    if (revalidatePath) revalidatePath(path);
    return updatedRestaurant;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const deleteRestaurant = async (restaurantId) => {
  try {
    await prisma.restaurants.delete({
      where: {
        id: restaurantId,
      },
    });
    revalidatePath("/");
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

export const getAllTagsWithRelations = async () => {
  const tags = await prisma.tags.findMany({
    include: {
      _count: {
        select: { restaurants: true },
      },
    },
  });
  return tags;
};

export const getTagsByIds = async (ids) => {
  if (ids.length === 0) return [];
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

export const updateTag = async (id, tagData) => {
  const parseResult = editTagSchema.safeParse(tagData);
  if (!parseResult) return null;

  try {
    await prisma.tags.update({
      where: {
        id,
      },
      data: {
        ...tagData,
      },
    });
  } catch {
    return null;
  }
  revalidatePath("/tags");
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
