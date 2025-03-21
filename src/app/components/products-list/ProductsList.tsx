import { Grid2, Typography } from "@mui/material";
import ProductItem from "./ProductItem";
import { ProductInterface } from "@/app/interfaces/products.interface";
import { getProductsByFilters } from "@/app/lib/firestore";

interface ProductListInterface {
  query: object;
  currentPage: number;
  maxPageSize: number;
}

const ProductsList: React.FC<ProductListInterface> = async ({
  query,
  currentPage,
  maxPageSize,
}) => {
  const productsData = await getProductsByFilters(
    maxPageSize,
    { productState: "on sale", ...query },
    currentPage
  );
  const products = JSON.parse(
    JSON.stringify(productsData.products)
  ) as ProductInterface[];
  return (
    <Grid2
      container
      direction="row"
      sx={{
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
        padding: "15px 0px",
      }}
      rowGap="25px"
      spacing={1}
      overflow="scroll"
    >
      {products.length > 0 ? (
        products?.map((product, index: number) => (
          <ProductItem product={product} key={index} />
        ))
      ) : (
        <Typography>No se encontraron productos.</Typography>
      )}
    </Grid2>
  );
};

export default ProductsList;
