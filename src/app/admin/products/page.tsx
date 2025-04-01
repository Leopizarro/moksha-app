import AdminProductsTable from "../../components/admin-products-table/AdminProductsTable";
import { ProductInterface } from "../../interfaces/products.interface";
import { getDocsFromCollection } from "../../lib/firestore";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `Productos - ${process.env.NEXT_PUBLIC_STORE_NAME}`,
  description: `Admin page - ${process.env.NEXT_PUBLIC_STORE_NAME}`,
};

export default async function AdminPage() {
  const data = await getDocsFromCollection("products");
  const products = JSON.parse(JSON.stringify(data));
  return (
    <main>
      <AdminProductsTable products={products.docs as ProductInterface[]} />
    </main>
  );
}
