import React from "react";
import { TextField } from "@mui/material";

type UrlInputProps = {
  url: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const UrlInput: React.FC<UrlInputProps> = ({ url, onChange }) => {
  return (
    <TextField
      fullWidth
      label="Request URL"
      value={url}
      onChange={onChange}
    />
  );
};

export default UrlInput;
