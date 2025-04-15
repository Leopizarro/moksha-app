"use client";
import React, { useEffect, useRef } from "react";
import {
  Box,
  Button,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import NextImage from "next/image";
import { deleteAllFilesFromFolder, uploadFile } from "@/app/lib/storage";
import {
  addProductToCollection,
  updateDocFromCollection,
} from "@/app/lib/firestore";
import {
  NewProductInterface,
  ProductInterface,
} from "@/app/interfaces/products.interface";
import { clientResizeImage, orderObjectsArrayByStrings } from "@/app/lib/utils";
import { convertFileToJpg } from "@/app/lib/heic-convert";
import { useSnackbar } from "@/app/hooks/useSnackbar";

interface UploadFormProps {
  productCategories: { name: string }[];
  productStates: { name: string }[];
  isEdit?: boolean;
  product?: ProductInterface;
}

const IMAGE_MAX_PIXELS = 900;

const UploadForm: React.FC<UploadFormProps> = ({
  productCategories,
  productStates,
  isEdit = false,
  product,
}: UploadFormProps) => {
  const [newProductData, setNewProductData] = useState<{
    title: string;
    description: string;
    price: number | "";
    productCategory: string;
    productState: string;
  }>({
    title: "",
    description: "",
    price: "",
    productCategory: "",
    productState: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setNewProductData({
        title: product.title,
        description: product.description,
        price: product.price,
        productCategory: product.productCategory,
        productState: product.productState,
      });
    }
  }, [product]);

  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    error: false,
    message: "",
  });

  const { setAlertObject, SnackbarComponent } = useSnackbar();

  const [newFile, setNewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const orderedCategories = orderObjectsArrayByStrings(
    productCategories,
    "name",
    "desc"
  );

  const orderedStates = orderObjectsArrayByStrings(
    productStates,
    "name",
    "desc"
  );

  function clearForm(): void {
    setNewProductData({
      title: "",
      description: "",
      price: "",
      productCategory: "",
      productState: "",
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
    setPreviewUrl(null);
    setNewFile(null);
  }

  function handleFormChange(value: string | number, field: string) {
    if (field === "price" && Number(value) <= 0) {
      value = "";
    }
    setNewProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0] ?? null;
    if (file && file.type !== "image/jpeg" && file.type !== "image/heic") {
      setNewFile(null);
      setPreviewUrl(null);
      setError({
        error: true,
        message: "Sólo se aceptan imágenes formato jpg/jpeg y HEIC",
      });
      return;
    }
    if (file) {
      setError({
        error: false,
        message: "",
      });
      if (file.type === "image/heic") {
        console.log("starting timer");
        console.time("testing");
        const convertedBlob = await convertFileToJpg(file);
        console.timeEnd("testing");
        console.log("expired timer");
        const convertedBlobing = new Blob([convertedBlob], {
          type: "image/jpeg",
        });
        file = new File(
          [convertedBlobing],
          file.name.replace(/\.heic$/i, ".jpg"),
          {
            type: "image/jpeg",
          }
        );
      }
      setNewFile(file);

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      const resizedImage = await clientResizeImage(
        file,
        IMAGE_MAX_PIXELS,
        IMAGE_MAX_PIXELS
      );

      const url = URL.createObjectURL(resizedImage);
      setNewFile(resizedImage);
      setPreviewUrl(url);

      return;
    }
    setNewFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage("creating");
    setLoading(true);
    // Do all the image upload and product upload
    try {
      let newProductRes;
      if (isEdit && product) {
        newProductRes = await updateDocFromCollection(
          "products",
          product.id,
          newProductData
        );
      } else {
        newProductRes = await addProductToCollection(newProductData);
      }
      if (newProductRes.ok && newFile && newProductRes.product) {
        if (isEdit && product) {
          await deleteAllFilesFromFolder(`images/${product.id}`);
          await deleteAllFilesFromFolder(`thumbnails/${product.id}`);
        }
        const imageUrls = await uploadFile(
          newFile,
          isEdit && product ? product.id : newProductRes.product.id
        );
        if (!imageUrls.imageUrl || !imageUrls.thumbnailImageUrl) {
          setStatusMessage("ERROR!");
          setLoading(false);
          setAlertObject({
            open: true,
            severity: "error",
            message: "There was an error uploading the image",
          });
        }
        const updateResponse = await updateDocFromCollection(
          "products",
          isEdit && product ? product.id : newProductRes.product.id,
          imageUrls as NewProductInterface
        );
        if (!updateResponse?.ok) {
          throw new Error("There was an error updating the information");
        }
      }
      setStatusMessage("created");
      setLoading(false);
      setAlertObject({
        open: true,
        severity: "success",
        message: "Product uploaded successfully!",
      });
      clearForm();
      return;
    } catch (error) {
      console.log(error);
      setStatusMessage("ERROR!");
      setLoading(false);
      setAlertObject({
        open: true,
        severity: "error",
        message: "There was an error uploading the image",
      });
    }
  };

  const buttonDisabled =
    newProductData?.title?.length < 1 ||
    newProductData?.description?.length < 1 ||
    Number(newProductData.price) < 1 ||
    !newProductData.productCategory ||
    !newProductData.productState ||
    (isEdit ? false : !newFile) ||
    error?.error ||
    loading;

  return (
    <form
      onSubmit={handleSubmit}
      style={{ width: "600px", maxWidth: "100%", minWidth: "300px" }}
    >
      {statusMessage && (
        <Typography align="center" sx={{ margin: "5px 0px" }}>
          {statusMessage}
        </Typography>
      )}

      <Box display="flex" flexDirection="column" gap={2}>
        <FormControl fullWidth>
          <TextField
            type="text"
            label="Nombre producto"
            required
            fullWidth
            value={newProductData.title}
            inputProps={{ "data-testid": "Title" }}
            onChange={(e) => handleFormChange(e.target.value, "title")}
          />
        </FormControl>

        <FormControl fullWidth>
          <TextField
            type="text"
            label="Descripción producto"
            multiline
            rows={4}
            required
            fullWidth
            value={newProductData.description}
            onChange={(e) => handleFormChange(e.target.value, "description")}
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel
            id="demo-simple-select-label"
            sx={{ background: "white", padding: "0px 3px" }}
          >
            Categoría
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={newProductData.productCategory}
            inputProps={{ "data-testid": "Gallery" }}
            onChange={(e) =>
              handleFormChange(e.target.value, "productCategory")
            }
            required
          >
            {orderedCategories?.map((item) => (
              <MenuItem key={item.name} value={item.name}>
                {item.name.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Preivew File */}
        <FormControl fullWidth>
          <TextField
            type="number"
            label="Precio"
            required
            fullWidth
            value={newProductData.price}
            onChange={(e) => handleFormChange(Number(e.target.value), "price")}
          />
        </FormControl>

        <FormControl fullWidth>
          <InputLabel
            id="demo-simple-select-label"
            sx={{ background: "white", padding: "0px 3px" }}
          >
            Estado
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={newProductData.productState}
            inputProps={{ "data-testid": "ProductState" }}
            onChange={(e) => handleFormChange(e.target.value, "productState")}
            required
          >
            {orderedStates?.map((item) => (
              <MenuItem key={item.name} value={item.name}>
                {item.name.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <input
            ref={fileInputRef}
            name="media"
            type="file"
            accept=".heic, .heif, image/heic, image/heif, image/jpeg"
            data-testid="file-input"
            onChange={handleFileChange}
            required={!isEdit}
          />
          {error?.error && (
            <Typography color="red">{error?.message ?? "error"}</Typography>
          )}
        </FormControl>
        {(previewUrl || product?.thumbnailImageUrl) && (
          <Grid2 size={12} sx={{ height: "240px", position: "relative" }}>
            <NextImage
              alt="preview-image"
              fill
              src={previewUrl ?? product?.thumbnailImageUrl ?? ""}
              style={{
                objectFit: "contain", // cover, contain, none
              }}
            />
          </Grid2>
        )}
      </Box>

      <FormControl fullWidth>
        <Button
          type="submit"
          variant="contained"
          color="success"
          sx={{ marginTop: "10px" }}
          disabled={buttonDisabled}
          aria-disabled={buttonDisabled}
        >
          {isEdit ? "Actualizar" : "Crear"}
        </Button>
      </FormControl>
      {SnackbarComponent}
    </form>
  );
};

export default UploadForm;
