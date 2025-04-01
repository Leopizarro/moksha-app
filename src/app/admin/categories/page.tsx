import AdminCategoriesTable from "@/app/components/admin-categories-table/AdminCategoriesTable";
import NewCategoryInput from "@/app/components/new-category-input/NewCategoryInput";
import { getDocsFromCollection } from "@/app/lib/firestore";
import { orderObjectsArrayByStrings } from "@/app/lib/utils";
import { Box, Typography } from "@mui/material";

export default async function ProductCategories() {
  const categories = await getDocsFromCollection("product_categories");
  let orderedCategories: { name: string; id: string }[] = [];
  if (categories.docs) {
    orderedCategories = orderObjectsArrayByStrings(
      categories.docs!,
      "name",
      "desc"
    );
  }
  return (
    <>
      <Typography
        align="center"
        margin={"10px"}
        fontWeight={"bold"}
        component={"h1"}
        fontSize={"1.45rem"}
      >
        Categorías Productos
      </Typography>
      <Box
        width="100%"
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <NewCategoryInput />
      </Box>
      <AdminCategoriesTable productCategories={orderedCategories} />;
    </>
  );
}
