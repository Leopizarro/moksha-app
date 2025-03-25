import { ProductInterface } from "@/app/interfaces/products.interface";
import { getProductsByFilters } from "@/app/lib/firestore";
import { Typography } from "@mui/material";
import ImageSlider from "./ImageSlider";

export default async function SoldProductsList() {
  const soldProductsData = await getProductsByFilters(
    8,
    {
      productState: "sold",
      soldAt: { operator: "orderBy", value: "desc" },
    },
    1
  );
  const soldProducts = JSON.parse(
    JSON.stringify(soldProductsData.products)
  ) as ProductInterface[];
  return (
    <>
      {soldProducts.length > 0 && (
        <>
          <Typography
            align="center"
            component={"h3"}
            fontSize="1.1rem"
            fontWeight={"bold"}
          >
            Vendidos Recientemente
          </Typography>
          <ImageSlider items={soldProducts} />
        </>
      )}
    </>
  );
}
