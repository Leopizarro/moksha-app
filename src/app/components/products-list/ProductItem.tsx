"use client";
import { ProductInterface } from "@/app/interfaces/products.interface";
import { firstLetterUpperCase, formatToCLP } from "@/app/lib/utils";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
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
        <Card sx={{ cursor: "pointer" }}>
          <CardContent>
            <Box
              sx={{
                position: "relative",
                minHeight: { xs: "330px", sm: "370px" },
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
                sizes="100vw"
                style={{
                  objectFit: "contain",
                }}
              />
            </Box>
            <Typography
              gutterBottom
              sx={{ color: "text.secondary", fontSize: 14 }}
            >
              {firstLetterUpperCase(product?.productCategory)}
            </Typography>
            <Typography variant="h6" component="div">
              {product?.title.toUpperCase()}
            </Typography>
            <Typography variant="body2">
              {formatToCLP(product?.price)}
            </Typography>
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
