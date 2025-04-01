import { createDocument, getDocumentByKeyValue } from "./firestore";

export async function createNewProductCategory(categoryName: string) {
  try {
    const categoryExists = await getDocumentByKeyValue(
      "product_categories",
      "name",
      categoryName.toLowerCase()
    );
    if (categoryExists) {
      throw new Error("La cateogría ya existe");
    }
    const newCategoryId = await createDocument("product_categories", {
      name: categoryName,
    });
    if (!newCategoryId) {
      throw new Error("Error trying to create the new category");
    }
    return {
      ok: true,
      message: "¡Categoría creada con éxito!",
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: `${
        error ?? "Ha ocurrido un error intentando crear la categoría"
      }`,
    };
  }
}
