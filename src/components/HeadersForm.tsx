import { Grid, TextField, Typography, Button, Box } from "@mui/material";

interface Header {
  key: string;
  value: string;
}

interface Props {
  headers: Header[];
  onChange: (index: number, field: "key" | "value", value: string) => void;
  onAdd: () => void;
}

const HeadersForm = ({ headers, onChange, onAdd }: Props) => (
  <Box mb={2}>
    <Typography variant="h6" gutterBottom>Headers</Typography>
    {headers.map((header, idx) => (
      <Grid container spacing={2} key={idx} sx={{ mb: 1 }}>
        <Grid spacing={2} key={idx} sx={{ mb: 1 }}>
          <TextField
            label="Key"
            fullWidth
            value={header.key}
            onChange={(e) => onChange(idx, "key", e.target.value)}
          />
        </Grid>
        <Grid container spacing={2} key={idx} sx={{ mb: 1 }}>
          <TextField
            label="Value"
            fullWidth
            value={header.value}
            onChange={(e) => onChange(idx, "value", e.target.value)}
          />
        </Grid>
      </Grid>
    ))}
    <Button variant="outlined" onClick={onAdd} sx={{ mt: 1 }}>
      + Add Header
    </Button>
  </Box>
);

export default HeadersForm;
