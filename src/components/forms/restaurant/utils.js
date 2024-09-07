export const tokenizeRestaurantName = (name) => {
  return name
    .trim()
    .toLowerCase()
    .replace(/[&\/\\#,+()$~%.:*?<>{}]/g, "")
    .split(" ")
    .filter((item) => item !== "")
    .join("-");
};
