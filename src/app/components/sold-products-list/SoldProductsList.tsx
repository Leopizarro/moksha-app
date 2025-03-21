import { ProductInterface } from "@/app/interfaces/products.interface";
import { getProductsByFilters } from "@/app/lib/firestore";
import Image from "next/image";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import classes from "./SoldProductList.module.css";

export default async function SoldProductsList() {
  const soldProductsData = await getProductsByFilters(
    8,
    {
      productState: "sold",
      soldAt: { operator: "orderBy", value: "desc" },
    },
    1
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
          <Box
            sx={{
              maxWidth: "100%", // Limit container width
              margin: "0px auto", // Center the container itself
              overflowX: "auto", // Allow horizontal scrolling
              display: "flex",
              justifyContent: "flex-start", // Align items to the start
              gap: 2, // Space between images
              padding: "10px 6px",
              whiteSpace: "nowrap", // Prevent images from wrapping
              "&::-webkit-scrollbar": { display: "none" }, // Hide scrollbar (optional)
            }}
          >
            {soldProducts.map((soldProduct) => (
              <Box key={soldProduct.title}>
                <Link href={`/product/${soldProduct.id}`}>
                  <Image
                    alt="test"
                    src={soldProduct.thumbnailImageUrl}
                    height={200}
                    width={200}
                    className={classes.grow}
                    style={{
                      borderRadius: "10px",
                      cursor: "pointer",
                      objectFit: "cover",
                    }}
                  />
                </Link>
              </Box>
            ))}
          </Box>
        </>
      )}
    </>
  );
}
