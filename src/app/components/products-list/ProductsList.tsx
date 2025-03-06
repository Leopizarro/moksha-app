import { Grid2 } from "@mui/material";
import ProductItem from "./ProductItem";
import { ProductInterface } from "@/app/interfaces/products.interface";

interface ProductListInterface {
  products: ProductInterface[];
}

const ProductsList: React.FC<ProductListInterface> = ({ products }) => {
  return (
    <Grid2
      container
      spacing={4}
      columns={12}
      size={12}
      margin="25px 10px"
      justifyContent="center"
      alignContent="center"
    >
      {products.length > 0 &&
        products?.map((product, index: number) => (
          <Grid2 size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} key={index}>
            <ProductItem product={product} />
          </Grid2>
        ))}
    </Grid2>
  );
};

export default ProductsList;
