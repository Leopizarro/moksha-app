"use client";
import React, { useEffect } from "react";
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
import Image from "next/image";
import GenericSnackbar from "../common/alert/GenericSnackbar";
import { deleteAllFilesFromFolder, uploadFile } from "@/app/lib/storage";
import {
  addProductToCollection,
  updateDocFromCollection,
} from "@/app/lib/firestore";
import { ProductInterface } from "@/app/interfaces/products.interface";

interface UploadFormProps {
  productCategories: { name: string }[];
  productStates: { name: string }[];
  isEdit: boolean;
  product: ProductInterface;
}

const UploadForm: React.FC<UploadFormProps> = ({
  productCategories,
  productStates,
  isEdit = false,
  product,
}: UploadFormProps) => {
  const [newProductData, setNewProductData] = useState({
    title: "",
    description: "",
    price: 0,
    productCategory: "",
    productState: "",
  });

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

  const [alertObject, setAlertObject] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleFormChange(value: string | number, field: string) {
    setNewProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFile(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleCloseAlert = () => {
    setAlertObject({ open: false, severity: "", message: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage("creating");
    setLoading(true);
    // Do all the image upload and product upload
    try {
      let newProductRes;
      if (!isEdit) {
        newProductRes = await addProductToCollection(newProductData);
      } else {
        newProductRes = await updateDocFromCollection(
          "products",
          product.id,
          newProductData
        );
      }
      if (newProductRes.ok && file) {
        if (isEdit) {
          await deleteAllFilesFromFolder(`images/${product.id}`);
          await deleteAllFilesFromFolder(`thumbnails/${product.id}`);
        }
        const imageUrls = await uploadFile(
          file,
          isEdit ? product.id : newProductRes.product.id
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
          isEdit ? product.id : newProductRes.product.id,
          imageUrls
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
    newProductData.title.length < 1 ||
    newProductData.description.length < 1 ||
    newProductData.price < 1 ||
    !newProductData.productCategory ||
    !newProductData.productState ||
    (isEdit ? false : !file) ||
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
            {productCategories.map((item) => (
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
            inputProps={{ "data-testid": "Price" }}
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
            {productStates.map((item) => (
              <MenuItem key={item.name} value={item.name}>
                {item.name.toUpperCase()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <input
            name="media"
            type="file"
            accept="image/jpeg"
            data-testid="file-input"
            onChange={handleFileChange}
            required={!isEdit}
          />
        </FormControl>
        {(previewUrl || product?.thumbnailImageUrl) && (
          <Grid2 size={12} sx={{ height: "240px", position: "relative" }}>
            <Image
              alt="preview-image"
              fill
              src={previewUrl || product.thumbnailImageUrl}
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
          Post
        </Button>
      </FormControl>
      <GenericSnackbar
        open={alertObject?.open}
        handleCloseAlert={handleCloseAlert}
        message={alertObject?.message}
        severity={alertObject?.severity}
      />
    </form>
  );
};

export default UploadForm;
