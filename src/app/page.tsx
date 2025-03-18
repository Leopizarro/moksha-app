"use server";

import { Suspense } from "react";
import Banner from "./components/banner/Banner";
import CustomPagination from "./components/pagination/Pagination";
import ProductFilers from "./components/product-filters/ProductFilters";
import ProductsList from "./components/products-list/ProductsList";
import getCountOfQuery, { getDocsFromCollection } from "./lib/firestore";
import styles from "./page.module.css";
import { CircularProgress, Grid2 } from "@mui/material";

const PAGE_SIZE = 12;

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
  ) as {
    id: string;
    name: string;
  }[];

  const query = {
    productCategory: productCategoryQuery,
  };

  const totalProductsData = await getCountOfQuery(query);
  const totalPages =
    totalProductsData?.count > PAGE_SIZE
      ? Math.floor(totalProductsData?.count / PAGE_SIZE) +
        (totalProductsData.count % PAGE_SIZE > 0 ? 1 : 0)
      : 1;
  console.log("pagecount", totalPages, totalProductsData?.count);
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
            justifyContent="center"
            margin="0px 15px"
          >
            <ProductFilers
              options={productCategories}
              field="productCategory"
            />
          </Grid2>
          <Suspense
            key={"test"}
            fallback={<CircularProgress sx={{ margin: "20px 15px" }} />}
          >
            <ProductsList
              query={query}
              currentPage={currentPage}
              maxPageSize={PAGE_SIZE}
            />
          </Suspense>
        </Grid2>
        <Grid2 size={12} justifyContent="center" display="flex">
          <CustomPagination count={totalPages} />
        </Grid2>
      </Grid2>
    </main>
  );
}
