"use client";
import { ProductInterface } from "@/app/interfaces/products.interface";
import { firstLetterUpperCase, formatToCLP } from "@/app/lib/utils";
import {
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import classes from "./ProductItem.module.css";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from "next/navigation";
import Modal from "../modal/Modal";
import { useState } from "react";
import { deleteDocFromCollection } from "@/app/lib/firestore";
import { deleteAllFilesFromFolder } from "@/app/lib/storage";
import GenericSnackbar from "../common/alert/GenericSnackbar";

interface ProductItemInterface {
  product: ProductInterface;
}

const ProductItem: React.FC<ProductItemInterface> = (props) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [alertObject, setAlertObject] = useState({
    open: false,
    severity: "",
    message: "",
  });
  const { data: session } = useSession();
  const { product } = props;
  const router = useRouter();

  const handleCloseAlert = () => {
    setAlertObject({ open: false, severity: "", message: "" });
  };

  async function handleDeleteProduct(productId: string) {
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

  return (
    <>
      <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
        <Card
          className={classes.grow}
          sx={{
            cursor: "pointer",
            width: "370px",
            justifySelf: "center",
            boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          }}
        >
          <CardContent sx={{ padding: 0, paddingBottom: 0 }}>
            <Box
              sx={{
                position: "relative",
                minHeight: { xs: "370px", sm: "370px" },
              }}
            >
              {session && (
                <>
                  <Tooltip title="Eliminar">
                    <IconButton
                      aria-label="delete"
                      size="small"
                      disabled={openModal}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenModal((prevValue) => !prevValue);
                      }}
                      sx={{
                        postion: "absolute",
                        background: "#d4af37",
                        margin: "10px",
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
                  <Tooltip title="Editar">
                    <IconButton
                      disabled={openModal}
                      aria-label="delete"
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation(); // Prevent the Link click event
                        event.preventDefault(); // Prevent default behavior
                        router.push(`/edit/${product.id}`);
                      }}
                      sx={{
                        postion: "absolute",
                        background: "#d4af37",
                        top: "0",
                        margin: "10px",
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
                </>
              )}
              <Image
                alt="thumbnail-image"
                src={product?.thumbnailImageUrl}
                quality={100}
                fill
                sizes="35vw"
                style={{
                  objectFit: "contain",
                }}
              />
            </Box>
            <Box
              padding="10px 15px 0px 15px"
              display="flex"
              flexDirection="column"
              rowGap={1}
            >
              <Divider
                textAlign="center"
                sx={{ fontSize: "12px", color: "gray" }}
              >
                {firstLetterUpperCase(product?.productCategory)}
              </Divider>
              <Typography variant="h6" component="div">
                {product?.title.toUpperCase()}
              </Typography>
              <Typography variant="body2">
                {formatToCLP(product?.price)}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Link>
      <Modal
        openModal={openModal}
        dialogMessage={`¿Estás seguro de eliminar el producto: ${product.title}?`}
        handleCancel={() => setOpenModal((prevValue) => !prevValue)}
        handleConfirm={() => handleDeleteProduct(product.id)}
      />
      <GenericSnackbar
        open={alertObject?.open}
        handleCloseAlert={handleCloseAlert}
        message={alertObject?.message}
        severity={alertObject?.severity}
      />
    </>
  );
};

export default ProductItem;
