"use server";

import Banner from "./components/banner/Banner";
import ProductFilers from "./components/product-filters/ProductFilters";
import ProductsList from "./components/products-list/ProductsList";
import { getDocsFromCollection } from "./lib/firestore";
import styles from "./page.module.css";
import { Grid2 } from "@mui/material";

export default async function Home(props: {
  searchParams?: Promise<{
    productCategory?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const productCategoryQuery = searchParams?.productCategory || "";
  const currentPage = Number(searchParams?.page) || 1;
  const productCategoriesData = await getDocsFromCollection(
    "product_categories"
  );
  const productCategories = JSON.parse(
    JSON.stringify(productCategoriesData.docs)
  ) as object[];

  const query = {
    productCategory: productCategoryQuery,
    /* page: currentPage, */
  };

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
          <Grid2
            size={12}
            display="flex"
            justifyContent="end"
            margin="0px 30px"
          >
            <ProductFilers
              options={productCategories}
              field="productCategory"
            />
          </Grid2>
          <ProductsList query={query} currentPage={currentPage} />
        </Grid2>
      </Grid2>
    </main>
  );
}
