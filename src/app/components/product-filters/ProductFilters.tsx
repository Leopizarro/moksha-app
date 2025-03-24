"use client";
import { orderObjectsArrayByStrings } from "@/app/lib/utils";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface FilterInterface {
  options: { id: string; name: string }[];
  field: string;
}

export default function ProductFilters({ options, field }: FilterInterface) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [optionSelected, setOptionSelected] = useState(
    searchParams.get(field)?.toString() ?? ""
  );
  let orderedOptions: { id: string; name: string }[] = [];
  if (options)
    orderedOptions = orderObjectsArrayByStrings(options, "name", "desc");

  function handleOnChange(value: string) {
    setOptionSelected(value);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (value) {
      params.set(field, value);
    } else {
      params.delete(field);
    }
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <FormControl size="small" sx={{ width: "230px", background: "white" }}>
      <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={optionSelected}
        label="Tipo"
        onChange={(e) => handleOnChange(e.target.value)}
      >
        <MenuItem key={"empty-option"} value={""}>
          {"TODOS"}
        </MenuItem>
        {orderedOptions?.map((item) => (
          <MenuItem key={item.name} value={item.name}>
            {item.name.toUpperCase()}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
