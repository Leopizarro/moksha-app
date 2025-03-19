"use client";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ProductInterface } from "@/app/interfaces/products.interface";
import { formatToCLP } from "@/app/lib/utils";
import Link from "next/link";
import Modal from "../modal/Modal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteDocFromCollection } from "@/app/lib/firestore";
import { deleteAllFilesFromFolder } from "@/app/lib/storage";
import GenericSnackbar from "../common/alert/GenericSnackbar";
import { SnackbarInterface } from "@/app/interfaces/genericSnackbar.interface";

interface AdminProductsTableInterface {
  products: ProductInterface[];
}

export default function AdminProductsTable({
  products,
}: AdminProductsTableInterface) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [alertObject, setAlertObject] = useState<SnackbarInterface>({
    open: false,
    severity: "success",
    message: "",
  });

  const router = useRouter();

  const handleCloseAlert = () => {
    setAlertObject({ open: false, severity: "success", message: "" });
  };

  async function deleteProduct(productId: string) {
    try {
      await deleteDocFromCollection("products", productId);
      await deleteAllFilesFromFolder(`images/${productId}`);
      await deleteAllFilesFromFolder(`thumbnails/${productId}`);
      setOpenModal(false);
      router.refresh(); // revalidate cache and update UI
      setAlertObject({
        open: true,
        severity: "success",
        message: "Producto borrado exitosamente",
      });
    } catch (error) {
      console.log(error);
      setAlertObject({
        open: true,
        severity: "error",
        message: "Hubo un error intentando borrar el producto",
      });
    }
  }

  function handleClickDelete(id: string, title: string) {
    setSelectedProduct({
      id,
      title,
    });
    setOpenModal((prevValue) => !prevValue);
  }
  return (
    <>
      {products?.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{ maxWidth: "1200px", justifySelf: "center", margin: "20px" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell align="right">Tipo</TableCell>
                <TableCell align="right">Estado</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell align="right">Fecha creación</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products?.length > 0 &&
                products?.map((row) => (
                  <TableRow
                    key={row.title}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.title}
                    </TableCell>
                    <TableCell align="right">{row.productCategory}</TableCell>
                    <TableCell align="right">{row.productState}</TableCell>
                    <TableCell align="right">
                      {formatToCLP(row.price)}
                    </TableCell>
                    <TableCell align="right" suppressHydrationWarning>
                      {new Date(row.createdAt.seconds * 1000).toDateString()}
                    </TableCell>
                    <TableCell>
                      {
                        <Box
                          display="flex"
                          gap={1}
                          alignSelf="right"
                          justifySelf="right"
                        >
                          <Link href={`/edit/${row.id}`}>
                            <Tooltip title="Editar">
                              <IconButton
                                disabled={openModal}
                                aria-label="delete"
                                size="small"
                                sx={{
                                  postion: "absolute",
                                  background: "#d4af37",
                                  top: "0",
                                  zIndex: 10,
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
                          </Link>
                          <Tooltip title="Eliminar">
                            <IconButton
                              aria-label="delete"
                              size="small"
                              disabled={openModal}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleClickDelete(row.id, row.title);
                              }}
                              sx={{
                                postion: "absolute",
                                background: "#d4af37",
                                top: "0",
                                zIndex: 10,
                                float: "left",
                                color: "white",
                                ":hover": {
                                  background: "#a28834",
                                },
                              }}
                            >
                              <DeleteIcon fontSize="inherit" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      }
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography align="center" margin="20px 10px">
          {" "}
          No se encontraron productos{" "}
        </Typography>
      )}
      <Modal
        openModal={openModal}
        dialogMessage={`¿Estás seguro de eliminar el producto: ${selectedProduct?.title}?`}
        handleCancel={() => setOpenModal((prevValue) => !prevValue)}
        handleConfirm={() =>
          deleteProduct(selectedProduct ? selectedProduct.id : "")
        }
      />
      <GenericSnackbar
        open={alertObject?.open}
        handleCloseAlert={handleCloseAlert}
        message={alertObject?.message}
        severity={alertObject?.severity}
      />
    </>
  );
}
