import UploadForm from "../components/upload-product/UploadForm";
import { Card, CardContent, Grid2, Typography } from "@mui/material";
import { getDocsFromCollection } from "../lib/firestore";

export const metadata = {
  title: "Upload a new product",
  description: process.env.NEXT_PUBLIC_STORE_NAME,
};
export default async function CreatePostForm() {
  const productCategories = await getDocsFromCollection("product_categories");
  const productStates = await getDocsFromCollection("product_states");

  return (
    <Grid2
      container
      alignContent="center"
      justifyContent="center"
      sx={{ marginTop: "40px" }}
    >
      <Card>
        <Grid2 container justifyContent="center" sx={{ marginTop: "10px" }}>
          <Typography>Añadir producto</Typography>
        </Grid2>
        <CardContent>
          <Grid2 container alignContent="center" justifyContent="center">
            {productCategories.docs && productStates.docs && (
              <UploadForm
                productCategories={productCategories.docs}
                productStates={productStates.docs}
              />
            )}
          </Grid2>
        </CardContent>
      </Card>
    </Grid2>
  );
}
