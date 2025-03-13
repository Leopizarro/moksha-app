"use server";

import Banner from "./components/banner/Banner";
import ProductsList from "./components/products-list/ProductsList";
import { ProductInterface } from "./interfaces/products.interface";
import { getDocsFromCollection } from "./lib/firestore";
import styles from "./page.module.css";
import { Grid2, Typography } from "@mui/material";

export default async function Home() {
  const data = await getDocsFromCollection("products");
  const products = JSON.parse(JSON.stringify(data));
  return (
    <main className={styles.page}>
      <Grid2 container size={12} direction="column" margin="30px 0px">
        <Grid2 size={12}>
          <Banner />
        </Grid2>
        <Grid2
          container
          size={12}
          justifyContent="center"
          alignContent="center"
        >
          {products.docs?.length && (
            <ProductsList products={products.docs as ProductInterface[]} />
          )}
          {!products.docs && (
            <Typography align="center">
              {" "}
              No se encontraron productos.{" "}
            </Typography>
          )}
        </Grid2>
      </Grid2>
    </main>
  );
}
