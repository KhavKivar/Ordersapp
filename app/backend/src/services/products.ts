import { db } from "../db/index.js";
import { products } from "../db/schema.js";

type Product = typeof products.$inferSelect;

export async function listProducts(): Promise<Product[]> {
  return db
    .select({
      id: products.id,
      name: products.name,
      type: products.type,
      sizeMl: products.sizeMl,
      sellPriceClient: products.sellPriceClient,
      buyPriceSupplier: products.buyPriceSupplier,
      description: products.description,
    })
    .from(products);
}
