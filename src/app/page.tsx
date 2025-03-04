import Banner from "./components/banner/Banner";
import ProductsList from "./components/products-list/ProductsList";
import styles from "./page.module.css";
import { Grid2 } from "@mui/material";

export default function Home() {
  return (
    <main className={styles.page}>
      <Grid2 container size={12} direction='column' margin='30px 0px'>
        <Grid2 size={12}>
          <Banner />
        </Grid2>
        <Grid2 container size={12} justifyContent='center' alignContent='center'>
          <ProductsList />
        </Grid2>
      </Grid2>
    </main>
  );
}
