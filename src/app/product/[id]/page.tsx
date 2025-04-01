import ProductInfoBox from "@/app/components/product-info-box/ProductInfoBox";
import { getOneDocFromCollection } from "@/app/lib/firestore";
import { Box, Typography } from "@mui/material";
import { Metadata } from "next";
import Image from "next/image";
import classes from "./page.module.css";

interface ProductDetailsInterface {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const productId = (await params).id;
  const product = await getOneDocFromCollection(productId, "products");

  return {
    title: `${product ? product?.title : "No encontrado"} - ${
      process.env.NEXT_PUBLIC_STORE_NAME
    }`,
    openGraph: {
      images: [product ? product?.thumbnailImageUrl : ""],
    },
  };
}

export default async function ProductDetails({
  params,
}: ProductDetailsInterface) {
  const productId = (await params).id;
  const product = await getOneDocFromCollection(productId, "products");
  return (
    <>
      <Box
        sx={{
          display: { xs: "block", lg: "flex" },
          height: "100%",
          justifySelf: "center",
          maxWidth: "1600px",
        }}
      >
        <Box
          sx={{ padding: "15px" }}
          justifyContent="center"
          display="flex"
          position="relative"
        >
          <Box
            minHeight={{ xs: "auto", md: "60vh", xl: "900px" }}
            minWidth={{ xs: "100%", sm: "600px", xl: "900px" }}
            position="relative"
            className={classes["image-container"]}
            sx={{
              boxShadow:
                "0 4px 10px 0 rgba(0, 0, 0, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.29)",
              aspectRatio: "1/1",
              overflow: "hidden",
            }}
          >
            <Image
              src={product.thumbnailImageUrl}
              alt="Background"
              fill // Fills entire box
              style={{
                filter: "blur(30px)", // Blurred effect
                objectFit: "cover",
                opacity: 0.77, // Dim the background
              }}
            />
            <Image
              alt="product-image"
              src={product.imageUrl}
              fill
              style={{
                objectFit: "contain",
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            maxWidth: "1200px",
          }}
        >
          <Box
            sx={{
              margin: "15px",
              padding: { xs: "5px 10px", lg: "25px 10px" },
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              maxWidth: "825px",
            }}
          >
            <ProductInfoBox product={product} />
          </Box>
        </Box>
      </Box>
      <Typography align="center" fontSize="0.8rem" padding="10px">
        *Se hacen entregas en la comuna de Peñalolén y comunas aledañas. En caso
        de necesitar envío, éste será vía Starken (por pagar).
      </Typography>
    </>
  );
}
