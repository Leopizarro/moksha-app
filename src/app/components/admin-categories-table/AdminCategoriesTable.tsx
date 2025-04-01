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
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from "../modal/Modal";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteDocFromCollection } from "@/app/lib/firestore";
import GenericSnackbar from "../common/alert/GenericSnackbar";
import { SnackbarInterface } from "@/app/interfaces/genericSnackbar.interface";
import { firstLetterUpperCase } from "@/app/lib/utils";

interface AdminCategoriesTableInterface {
  productCategories: { id: string; name: string }[];
}

export default function AdminCategoriesTable({
  productCategories,
}: AdminCategoriesTableInterface) {
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

  async function deleteCategory(categoryId: string) {
    try {
      await deleteDocFromCollection("product_categories", categoryId);
      setOpenModal(false);
      router.refresh(); // revalidate cache and update UI
      setAlertObject({
        open: true,
        severity: "success",
        message: "Categoría borrada exitosamente",
      });
    } catch (error) {
      console.log(error);
      setAlertObject({
        open: true,
        severity: "error",
        message: "Hubo un error intentando borrar la categoría",
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
      {productCategories?.length > 0 ? (
        <TableContainer
          component={Paper}
          sx={{
            maxWidth: "350px",
            maxHeight: "600px",
            justifySelf: "center",
            margin: "20px",
          }}
        >
          <Table sx={{ minWidth: 250 }} aria-label="simple table" stickyHeader>
            <TableHead sx={{ background: "white" }}>
              <TableRow>
                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold", zIndex: 11 }}
                >
                  Nombre
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ fontWeight: "bold", zIndex: 11 }}
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productCategories?.length > 0 &&
                productCategories?.map((row, index) => (
                  <TableRow
                    key={`${row.name}-${index}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" align="center">
                      {row.name
                        .split("/")
                        .map((word) => firstLetterUpperCase(word))
                        .join("/")}
                    </TableCell>
                    <TableCell>
                      {
                        <Box
                          display="flex"
                          gap={1}
                          alignSelf="center"
                          justifySelf="center"
                        >
                          {/* <Link href={`/edit/${row.id}`}>
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
                          </Link> */}
                          <Tooltip title="Eliminar">
                            <IconButton
                              aria-label="delete"
                              size="small"
                              disabled={openModal}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleClickDelete(row.id, row.name);
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
          deleteCategory(selectedProduct ? selectedProduct.id : "")
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
