import React, { useState } from "react";
import { Container, Typography, Card, Grid, Box, Button } from "@mui/material";
import axios from "axios";
import UrlInput from "./components/UrlInput";
import MethodSelector from "./components/MethodSelector";
import QueryParamsForm from "./components/QueryParamsForm";
import HeadersForm from "./components/HeadersForm";
import RequestBodyInput from "./components/RequestBodyInput";
import ResponseDisplay from "./components/ResponseDisplay";

const App: React.FC = () => {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [queryParams, setQueryParams] = useState<{ key: string; value: string }[]>([]);
  const [body, setBody] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const parseQueryParams = (url: string) => {
    try {
      const u = new URL(url);
      const paramsArray = Array.from(u.searchParams.entries()).map(([key, value]) => ({ key, value }));
      setQueryParams(paramsArray);
    } catch (_) {
      setQueryParams([]);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    parseQueryParams(value);
  };

  const handleHeaderChange = (index: number, field: "key" | "value", value: string) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const addHeaderField = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const handleQueryParamChange = (index: number, field: "key" | "value", value: string) => {
    const newParams = [...queryParams];
    newParams[index][field] = value;
    setQueryParams(newParams);

    try {
      const u = new URL(url.split("?")[0]);
      newParams.forEach((p) => {
        if (p.key) u.searchParams.set(p.key, p.value);
      });
      setUrl(u.toString());
    } catch (_) {}
  };

  const addQueryParamField = () => {
    setQueryParams([...queryParams, { key: "", value: "" }]);
  };

  const sendRequest = async () => {
    try {
      setLoading(true);
      setError("");
      setResponse(null);
      setStatus(null); 
      setResponseTime(null);

      const headerObj: Record<string, string> = {};
      headers.forEach((h) => {
        if (h.key) headerObj[h.key] = h.value;
      });

      const config: any = {
        method,
        url,
        headers: headerObj,
      };

      if (["POST", "PUT", "PATCH"].includes(method)) {
        config.data = body ? JSON.parse(body) : {};
      }

      const startTime = performance.now();
      const res = await axios(config);
      const endTime = performance.now();

      setResponse(res.data);
      setStatus(res.status); 
      setResponseTime(endTime - startTime); 
    } catch (err: any) {
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 4 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        API Testing
      </Typography>

      <Card sx={{ p: 3, mb: 2 }}>
        <Grid container spacing={2} direction="column">     
          <Box display="flex" gap={2}>
            <Box flex={1}>
              <UrlInput url={url} onChange={handleUrlChange} />
            </Box>
            <Box width="200px">
              <MethodSelector method={method} onChange={setMethod} />
            </Box>
          </Box>
          <Grid container spacing={2}>
            <QueryParamsForm
              queryParams={queryParams}
              onChange={handleQueryParamChange}
              onAdd={addQueryParamField}
            />
          </Grid>
          <Grid container spacing={2}>
            <HeadersForm headers={headers} onChange={handleHeaderChange} onAdd={addHeaderField} />
          </Grid>
          {["POST", "PUT", "PATCH"].includes(method) && (
            <Grid container spacing={2}>
              <RequestBodyInput body={body} onChange={setBody} />
            </Grid>
          )}
          <Grid container spacing={2}>
            <Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={sendRequest}
                disabled={loading || !url}
              >
                {loading ? "Sending..." : "Send Request"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>

      <ResponseDisplay
        status={status}
        time={responseTime}
        response={response}
        error={error}
      />
    </Container>
  );
};

export default App;
