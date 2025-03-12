import { ProductInterface } from "@/app/interfaces/products.interface";
import { firstLetterUpperCase, formatToCLP } from "@/app/lib/utils";
import { Box, Button, Typography } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

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
        <Button
          variant="contained"
          color="success"
          sx={{ fontWeight: "bold", width: "100%" }}
          startIcon={<WhatsAppIcon />}
        >
          CONTACTAR
        </Button>
      </Box>
    </>
  );
}
