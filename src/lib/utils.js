import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const fetcher = (...args) => fetch(...args).then((res) => res.json());

export function generateRandomHexColour() {
  const hex = [1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
  let hexColor = "#";
  for (let i = 0; i < 6; i++) {
    hexColor += hex[Math.floor(Math.random() * hex.length)];
  }
  return hexColor;
}

export function generateRandomRGBColour() {
  return [Math.random() * 255, Math.random() * 255, Math.random() * 255];
}

export function hexToRgb(hex) {
  var hex_color = hex.replace("#", "");
  let r = parseInt(hex_color.substring(0, 2), 16);
  let g = parseInt(hex_color.substring(2, 4), 16);
  let b = parseInt(hex_color.substring(4, 6), 16);
  const output = [r, g, b];

  return output;
}

export function isLightTextContrasting(rgbArr) {
  const srgb = [rgbArr[0] / 255, rgbArr[1] / 255, rgbArr[2] / 255];
  const x = srgb.map((i) => {
    if (i <= 0.04045) {
      return i / 12.92;
    } else {
      return Math.pow((i + 0.055) / 1.055, 2.4);
    }
  });
  const L = 0.2126 * x[0] + 0.7152 * x[1] + 0.0722 * x[2];
  return L <= 0.179;
}

export function generateValidLightContrastColour() {
  let foundColour = false;
  let finalColour;
  while (!foundColour) {
    const randColour = generateRandomHexColour();
    if (isLightTextContrasting(hexToRgb(randColour))) {
      finalColour = randColour;
      foundColour = true;
    }
  }
  return finalColour;
}
