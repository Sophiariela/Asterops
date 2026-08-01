import { products } from "@/config/products";

export const productInterestOptions = [
  ...products.map((product) => product.name),
  "Not sure yet",
] as unknown as [string, ...string[]];
