import CustomPagination from "@/app/components/pagination/Pagination";
import AdminProductsTable from "../../components/admin-products-table/AdminProductsTable";
import { ProductInterface } from "../../interfaces/products.interface";
import getCountOfQuery, { getProductsByFilters } from "../../lib/firestore";
import { Box } from "@mui/material";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `Productos - ${process.env.NEXT_PUBLIC_STORE_NAME}`,
  description: `Admin page - ${process.env.NEXT_PUBLIC_STORE_NAME}`,
};

const PAGE_SIZE = 12;

const query = {
  createdAt: { operator: "orderBy", value: "desc" },
};

export default async function AdminPage(props: {
  searchParams?: Promise<{
    productCategory?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const totalProductsData = await getCountOfQuery(query);
  const totalPages =
    totalProductsData?.count > PAGE_SIZE
      ? Math.floor(totalProductsData?.count / PAGE_SIZE) +
        (totalProductsData.count % PAGE_SIZE > 0 ? 1 : 0)
      : 1;
  const data = await getProductsByFilters(PAGE_SIZE, query, currentPage);
  const products = JSON.parse(JSON.stringify(data?.products));
  return (
    <main>
      <AdminProductsTable products={products as ProductInterface[]} />
      <Box justifySelf={"center"}>
        <CustomPagination count={totalPages} />
      </Box>
    </main>
  );
}
