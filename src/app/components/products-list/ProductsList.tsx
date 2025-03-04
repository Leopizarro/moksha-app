import { Grid2 } from "@mui/material";
import ProductItem from "./ProductItem";
import mmLogo from "../../../../public/asd.jpg";
import nnLogo from "../../../../public/railslogo.png";
import wwLogo from "../../../../public/a.jpeg";

const productsMock = [
  {
    category: "Espejo",
    title: "Producto #1",
    price: 12000,
    url: mmLogo,
  },
  {
    category: "Caja",
    title: "Producto #2",
    price: 22000,
    url: mmLogo,
  },
  {
    category: "Colgador",
    title: "Producto #3",
    price: 32000,
    url: mmLogo,
  },
  {
    category: "Espejo",
    title: "Producto #4",
    price: 68000,
    url: mmLogo,
  },
  {
    category: "Tornamesa",
    title: "Producto #5",
    price: 44000,
    url: mmLogo,
  },
  {
    category: "Tornamesa",
    title: "Producto #6",
    price: 50000,
    url: nnLogo,
  },
];

const ProductsList: React.FC = () => {
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
      {productsMock.map((product, index: number) => (
        <Grid2 size={{ xs: 12, sm: 6, lg: 4, xl: 3 }} key={index}>
          <ProductItem product={product} />
        </Grid2>
      ))}
    </Grid2>
  );
};

export default ProductsList;
