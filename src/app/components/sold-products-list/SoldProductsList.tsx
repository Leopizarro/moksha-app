import { ProductInterface } from "@/app/interfaces/products.interface";
import { getProductsByFilters } from "@/app/lib/firestore";
import { Typography } from "@mui/material";
import ImageSlider from "./ImageSlider";

const MAX_PAGE_SIZE = 8; // it will fetch only 8 items
const CURRENT_PAGE = 1; // this is to get always the first 'page' (latest products)

export default async function SoldProductsList() {
  const soldProductsData = await getProductsByFilters(
    MAX_PAGE_SIZE,
    {
      productState: "sold",
      soldAt: { operator: "orderBy", value: "desc" },
    },
    CURRENT_PAGE
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
