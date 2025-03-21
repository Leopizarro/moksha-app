"use server";

import { Suspense } from "react";
import Banner from "./components/banner/Banner";
import CustomPagination from "./components/pagination/Pagination";
import ProductsList from "./components/products-list/ProductsList";
import getCountOfQuery, { getDocsFromCollection } from "./lib/firestore";
import styles from "./page.module.css";
import {
  Box,
  Button,
  CircularProgress,
  Grid2,
  Typography,
} from "@mui/material";
import Link from "next/link";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SoldProductsList from "./components/sold-products-list/SoldProductsList";
import ProductFilters from "./components/product-filters/ProductFilters";

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
    createdAt: { operator: "orderBy", value: "desc" },
  };

  const totalProductsData = await getCountOfQuery(query);
  const totalPages =
    totalProductsData?.count > PAGE_SIZE
      ? Math.floor(totalProductsData?.count / PAGE_SIZE) +
        (totalProductsData.count % PAGE_SIZE > 0 ? 1 : 0)
      : 1;
  return (
    <main className={styles.page}>
      <Grid2 container size={12} direction="column" margin="30px 0px">
        <Grid2
          size={12}
          overflow="scroll"
          sx={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
        >
          <Banner />
        </Grid2>
        <Grid2
          container
          alignSelf={"center"}
          width={"100%"}
          maxWidth={1200}
          padding={{ xs: "0", sm: "0px 10px" }}
        >
          <Grid2
            width={"100%"}
            display={"flex"}
            flexDirection={"column"}
            sx={{
              /* overflowX: "scroll", */
              margin: "10px 0px 0px 0px",
              padding: "8px 5px",
              background: "white",
              border: { xs: "none", sm: "1px solid #eac102" },
              borderTop: { xs: "1px solid #eac102" },
              borderBottom: { xs: "1px solid #eac102" },
              borderRadius: { xs: "0px", sm: "10px" },
              boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            }}
          >
            <SoldProductsList />
            <Typography align="center" fontSize="0.9rem">
              ¿Buscas un diseño similar a un producto{" "}
              {process.env.NEXT_PUBLIC_STORE_NAME} o tienes una idea en mente?
            </Typography>
            <Typography align="center" fontSize="0.9rem" fontWeight={"bold"}>
              Contáctate conmigo
            </Typography>
            <Box display="flex" justifyContent="center">
              <Link
                href={`https://wa.me/${process.env.NEXT_PUBLIC_OWNERS_PHONE}`}
              >
                <Button
                  variant="contained"
                  color="success"
                  sx={{
                    fontWeight: "bold",
                    width: "100%",
                    minWidth: "230px",
                    margin: "6px 0px",
                  }}
                  startIcon={<WhatsAppIcon />}
                >
                  CONTACTAR
                </Button>
              </Link>
            </Box>
          </Grid2>
          <Grid2 size={12} marginTop={"10px"}>
            <Typography
              align="center"
              component={"h3"}
              fontSize="1.1rem"
              fontWeight={"bold"}
            >
              Productos Disponibles
            </Typography>
          </Grid2>
          <Grid2
            size={12}
            display="flex"
            justifyContent="center"
            margin="10px 15px"
          >
            <ProductFilters
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
