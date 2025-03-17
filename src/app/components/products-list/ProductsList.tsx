import { Grid2, Typography } from "@mui/material";
import ProductItem from "./ProductItem";
import { ProductInterface } from "@/app/interfaces/products.interface";

interface ProductListInterface {
  products: ProductInterface[];
}

const ProductsList: React.FC<ProductListInterface> = ({ products }) => {
  return (
    <Grid2
      container
      direction="row"
      sx={{
        justifyContent: "space-around",
        alignItems: "center",
        margin: "25px 8px",
        width: "100%",
      }}
      rowGap="25px"
      spacing={1}
    >
      {products?.map((product, index: number) => (
        <ProductItem product={product} key={index} />
      ))}
    </Grid2>
  );
};

export default ProductsList;
