import { TextField, MenuItem } from "@mui/material";

const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

interface Props {
  method: string;
  onChange: (value: string) => void;
}

const MethodSelector = ({ method, onChange }: Props) => (
  <TextField select fullWidth label="HTTP Method" value={method} onChange={(e) => onChange(e.target.value)}>
    {methods.map((m) => (
      <MenuItem key={m} value={m}>
        {m}
      </MenuItem>
    ))}
  </TextField>
);

export default MethodSelector;
