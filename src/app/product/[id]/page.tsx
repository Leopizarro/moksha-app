import ProductInfoBox from "@/app/components/product-info-box/ProductInfoBox";
import { getOneDocFromCollection } from "@/app/lib/firestore";
import { firstLetterUpperCase, formatToCLP } from "@/app/lib/utils";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";

interface ProductDetailsInterface {
  params: Promise<{ id: string }>;
}

export default async function ProductDetails({
  params,
}: ProductDetailsInterface) {
  const productId = (await params).id;
  const product = await getOneDocFromCollection(productId, "products");
  console.log("product data->", product);
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
            sx={{
              boxShadow:
                "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
              aspectRatio: "1/1",
            }}
          >
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
        *Se hacen entregas en la comuna de Peñalolén y alrededores. En caso de
        necesitar envío, éste será vía Starken (por pagar).
      </Typography>
    </>
  );
}
