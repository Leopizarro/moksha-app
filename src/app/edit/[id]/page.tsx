import UploadForm from "@/app/components/upload-product/UploadForm";
import {
  getDocsFromCollection,
  getOneDocFromCollection,
} from "@/app/lib/firestore";
import { Card, CardContent, Grid2, Typography } from "@mui/material";

interface EditProductInterface {
  params: Promise<{ id: string }>;
}

export default async function EditProduct({ params }: EditProductInterface) {
  const productCategories = await getDocsFromCollection("product_categories");
  const productStates = await getDocsFromCollection("product_states");
  const productId = (await params).id;
  const product = await getOneDocFromCollection(productId, "products");
  const data = JSON.parse(JSON.stringify(product));
  return (
    <Card sx={{ marginTop: "30px" }}>
      <Grid2 container justifyContent="center" sx={{ marginTop: "10px" }}>
        <Typography>Editar producto</Typography>
      </Grid2>
      <CardContent>
        <Grid2 container alignContent="center" justifyContent="center">
          {productCategories.docs && productStates.docs && (
            <UploadForm
              productCategories={productCategories.docs}
              productStates={productStates.docs}
              product={data}
              isEdit
            />
          )}
        </Grid2>
      </CardContent>
    </Card>
  );
}
