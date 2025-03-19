import AdminProductsTable from "../components/admin-products-table/AdminProductsTable";
import { ProductInterface } from "../interfaces/products.interface";
import { getDocsFromCollection } from "../lib/firestore";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getDocsFromCollection("products");
  const products = JSON.parse(JSON.stringify(data));
  return (
    <main>
      <AdminProductsTable products={products.docs as ProductInterface[]} />
    </main>
  );
}
