"use client";
import { ProductInterface } from "@/app/interfaces/products.interface";
import { firstLetterUpperCase, formatToCLP } from "@/app/lib/utils";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";

interface ProductItemInterface {
  product: ProductInterface;
}

const ProductItem: React.FC<ProductItemInterface> = (props) => {
  const { data: session } = useSession();
  const { product } = props;
  const router = useRouter();
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
            <Tooltip title="Editar">
              <IconButton
                aria-label="delete"
                size="medium"
                onClick={(event) => {
                  event.stopPropagation(); // Prevent the Link click event
                  event.preventDefault(); // Prevent default behavior
                  router.push(`/edit/${product.id}`);
                }}
                sx={{
                  postion: "absolute",
                  background: "#d4af37",
                  top: "0",
                  zIndex: 10000,
                  float: "right",
                  color: "white",
                  ":hover": {
                    background: "#a28834",
                  },
                }}
              >
                <EditIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Image
              alt="thumbnail-image"
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
