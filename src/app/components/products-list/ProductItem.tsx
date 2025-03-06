import { ProductInterface } from "@/app/interfaces/products.interface";
import { firstLetterUpperCase, formatToCLP } from "@/app/lib/utils";
import { Box, Card, CardContent, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

interface ProductItemInterface {
  product: ProductInterface;
}

const ProductItem: React.FC<ProductItemInterface> = (props) => {
  const { product } = props;
  console.log("aaa", product.createdAt.toDate(), "productid->", product?.id);
  return (
    <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
      <Card sx={{ cursor: "pointer" }}>
        <CardContent>
          <Box
            sx={{
              position: "relative",
              minHeight: { xs: "330px", sm: "370px" },
            }}
          >
            <Image
              alt="Mountains"
              src={product?.thumbnailImageUrl}
              quality={100}
              fill
              sizes="100vw"
              style={{
                objectFit: "contain",
              }}
            />
          </Box>
          <Typography
            gutterBottom
            sx={{ color: "text.secondary", fontSize: 14 }}
          >
            {firstLetterUpperCase(product?.productCategory)}
          </Typography>
          <Typography variant="h6" component="div">
            {product?.title.toUpperCase()}
          </Typography>
          <Typography variant="body2">{formatToCLP(product?.price)}</Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductItem;
