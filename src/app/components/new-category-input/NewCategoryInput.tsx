"use client";
import { createNewProductCategory } from "@/app/lib/actions";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/app/hooks/useSnackbar";

export default function NewCategoryInput() {
  const [newCategory, setNewCategory] = useState<string | "">("");
  const { setAlertObject, SnackbarComponent } = useSnackbar();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleCreateCategory = async () => {
    try {
      setIsLoading(true);
      const res = await createNewProductCategory(newCategory);
      if (res.ok) {
        setIsLoading(false);
        setAlertObject({
          open: true,
          severity: "success",
          message: res.message,
        });
        setNewCategory("");
        router.refresh();
        return;
      }
      setIsLoading(false);
      setAlertObject({
        open: true,
        severity: "error",
        message: res.message ?? "Ha ocurrido un error creando la categoría",
      });
      return;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <TextField
        type="text"
        label="Nueva Categoría"
        sx={{ background: "white", margin: "0px 10px" }}
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      ></TextField>
      <Button
        variant="contained"
        disabled={!newCategory || isLoading}
        onClick={handleCreateCategory}
        color="success"
      >
        Crear
      </Button>
      {SnackbarComponent}
    </>
  );
}
