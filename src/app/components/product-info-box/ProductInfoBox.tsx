import { ProductInterface } from "@/app/interfaces/products.interface";
import { firstLetterUpperCase, formatToCLP } from "@/app/lib/utils";
import { Box, Button, Typography } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Link from "next/link";

interface ProductInfoBoxInterface {
  product: ProductInterface;
}

export default function ProductInfoBox({ product }: ProductInfoBoxInterface) {
  return (
    <>
      <Box>
        <Typography fontSize="2.6rem" component="h1" fontWeight="bold">
          {product.title}
        </Typography>
        <Typography fontSize="1.1rem">
          {firstLetterUpperCase(product.productCategory)}
        </Typography>
        <Typography fontSize="1.3rem" marginTop={{ sm: "20px", lg: "40px" }}>
          {product?.description}
        </Typography>
      </Box>
      <Typography fontSize="2.4rem" fontWeight="bold" margin="10px 0px">
        {formatToCLP(product.price)}
      </Typography>
      <Box width="100%">
        <Typography align="center">
          ¿Te interesa el prouducto? ¡Contáctame por whatsapp!
        </Typography>
        <Link
          href={`https://wa.me/${process.env.NEXT_PUBLIC_OWNERS_PHONE}?text=¡Hola!%2C%20Me%20interesa%20el%20producto%3A%20${product.title}.`}
        >
          <Button
            variant="contained"
            color="success"
            sx={{ fontWeight: "bold", width: "100%" }}
            startIcon={<WhatsAppIcon />}
          >
            CONTACTAR
          </Button>
        </Link>
      </Box>
    </>
  );
}
