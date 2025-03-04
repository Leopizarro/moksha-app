import { Box, Card, CardContent, Typography } from "@mui/material";
import Image from "next/image";

const ProductItem: React.FC = (props) => {
    const { product } = props;
    return (
        <Card sx={{ cursor: 'pointer'}}>
            <CardContent>
            <Box sx={{ position: "relative", minHeight: { xs: '330px', sm: "370px"} }}>
      <Image
        alt="Mountains"
        src={product?.url}
        quality={100}
        fill
        sizes="100vw"
        style={{
          objectFit: "contain",
        }}
      />
    </Box>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
        {product?.category}
      </Typography>
      <Typography variant="h6" component="div">
        {product?.title}
      </Typography>
      <Typography variant="body2">
        {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(
            product?.price,
        )}
      </Typography>
    </CardContent>
        </Card>
    )
}

export default ProductItem;