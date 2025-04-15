import { Grid, TextField, Typography, Button, Box } from "@mui/material";

interface Param {
  key: string;
  value: string;
}

interface Props {
  queryParams: Param[];
  onChange: (index: number, field: "key" | "value", value: string) => void;
  onAdd: () => void;
}

const QueryParamsForm = ({ queryParams, onChange, onAdd }: Props) => (
  <Box mb={2}>
    <Typography variant="h6" gutterBottom>Query Parameters</Typography>
    {queryParams.map((param, idx) => (
      <Grid container spacing={2} key={idx} sx={{ mb: 1 }}>
        <Grid container spacing={2} key={idx} sx={{ mb: 1 }}>
          <TextField
            label="Key"
            fullWidth
            value={param.key}
            onChange={(e) => onChange(idx, "key", e.target.value)}
          />
        </Grid>
        <Grid container spacing={2} key={idx} sx={{ mb: 1 }}>
          <TextField
            label="Value"
            fullWidth
            value={param.value}
            onChange={(e) => onChange(idx, "value", e.target.value)}
          />
        </Grid>
      </Grid>
    ))}
    <Button variant="outlined" onClick={onAdd} sx={{ mt: 1 }}>
      + Add Query Param
    </Button>
  </Box>
);

export default QueryParamsForm;
