"use client";
import { Pagination } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface CustomPaginationInterface {
  count: number;
}

export default function CustomPagination({ count }: CustomPaginationInterface) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  function handleChangePage(event: React.ChangeEvent<unknown>, value: number) {
    createPageURL(value);
  }
  return (
    <Pagination count={count} page={currentPage} onChange={handleChangePage} />
  );
}
