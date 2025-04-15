import { Typography, TextField, Box } from "@mui/material";

interface Props {
  body: string;
  onChange: (value: string) => void;
}

const RequestBodyInput = ({ body, onChange }: Props) => (
  <Box mb={2}>
    <Typography variant="h6" gutterBottom>Body (JSON)</Typography>
    <TextField
      fullWidth
      multiline
      minRows={4}
      placeholder='e.g. { "name": "John" }'
      value={body}
      onChange={(e) => onChange(e.target.value)}
    />
  </Box>
);

export default RequestBodyInput;
