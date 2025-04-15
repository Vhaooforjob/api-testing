import { Card, CardContent, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

interface Props {
  status: number | null;
  time: number | null;
  response: any;
  error: string;
}

const ResponseDisplay = ({ status, time, response, error }: Props) => {
  const renderJson = () => (
    <Box sx={{ marginTop: 4}}>
      <Typography variant="h6">JSON Response</Typography>
      <Box component="pre" sx={{ backgroundColor: "#f4f4f4", padding: 2, borderRadius: 4, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
        <code>{JSON.stringify(response, null, 2)}</code>
      </Box>
    </Box>
  );

  const renderTable = () => {
    if (!response || typeof response !== "object") return null;
  
    return (
      <Box sx={{marginTop: 4}}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
          Table Response
        </Typography>
  
        {Object.entries(response).map(([key, data]: any) => (
          <Box key={key} sx={{ mb: 4, border: '1px solid #ccc', borderRadius: 2, padding: 2, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Table for: {key}
            </Typography>
            <TableContainer component={Paper} sx={{ overflowX: 'auto', maxWidth: '100%' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {Object.keys(data).map((colKey) => (
                      <TableCell key={colKey}>{colKey}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    {Object.values(data).map((val, i) => (
                      <TableCell key={i}>
                        {typeof val === "string" || typeof val === "number"
                          ? val
                          : JSON.stringify(val)}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">📦 Response</Typography>
        {status !== null && (
          <Typography color="textSecondary">
            Status: {status} | Time: {time?.toFixed(2)} ms
          </Typography>
        )}
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : response ? (
          <>
            {renderJson()}
            {renderTable()}
          </>
        ) : (
          <Typography color="textSecondary">No response yet.</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ResponseDisplay;
