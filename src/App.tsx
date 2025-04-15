import React, { useState } from "react";
import * as Mui from "@mui/material";
import axios from "axios";

const methods = ["GET", "POST", "PUT", "DELETE", "PATCH"];

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
      const duration = endTime - startTime;

      setResponse(res.data);
      setStatus(res.status); 
      setResponseTime(duration); 
    } catch (err: any) {
      setError(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const renderTable = () => {
    if (!response) return null;
  
    return Object.keys(response).map((key) => {
      return (
        <div>
          <Mui.Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
            Table Response
          </Mui.Typography>
          {Object.keys(response).map((key) => {
            const data = response[key];

            return (
              <div key={key} style={{ marginBottom: '32px', backgroundColor: "#f4f4f4", padding: "10px" }}>
                <Mui.Typography variant="h6" sx={{ marginBottom: 2 }}>
                  {key}
                </Mui.Typography>
                <Mui.TableContainer component={Mui.Paper} sx={{ marginTop: 1 }}>
                  <Mui.Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <Mui.TableHead>
                      <Mui.TableRow>
                        {Object.keys(data).map((colKey) => (
                          <Mui.TableCell key={colKey}>{colKey}</Mui.TableCell>
                        ))}
                      </Mui.TableRow>
                    </Mui.TableHead>
                    <Mui.TableBody>
                      <Mui.TableRow>
                        {Object.values(data).map((value, index) => (
                          <Mui.TableCell key={index}>
                            {typeof value === 'string' || typeof value === 'number' ? value : JSON.stringify(value)}
                          </Mui.TableCell>
                        ))}
                      </Mui.TableRow>
                    </Mui.TableBody>
                  </Mui.Table>
                </Mui.TableContainer>
              </div>
            );
          })}
        </div>
      );
    });
  };

  const renderJsonResponse = () => {
    return (
      <Mui.Box sx={{ marginTop: 4 }}>
        <Mui.Typography variant="h6">JSON Response</Mui.Typography>
        <Mui.Box component="pre" sx={{ backgroundColor: "#f4f4f4", padding: 2, whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
          <code>{JSON.stringify(response, null, 2)}</code>
        </Mui.Box>
      </Mui.Box>
    );
  };  

  return (
    <Mui.Container maxWidth="md" sx={{ mt: 6, mb: 4}}>
      <Mui.Typography variant="h4" fontWeight={600} gutterBottom>
        API Testing 
      </Mui.Typography>
      <Mui.Card sx={{ p: 3, mb: 2 }}>
        <Mui.Grid container spacing={10}>
          <Mui.Box mb={2} sx={{ flexGrow: 1 }}>
            <Mui.TextField
              fullWidth
              label="Request URL"
              value={url}
              onChange={handleUrlChange}
            />
          </Mui.Box>
          <Mui.Box>
            <Mui.TextField
              select
              fullWidth
              label="HTTP Method"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              {methods.map((m) => (
                <Mui.MenuItem key={m} value={m}>
                  {m}
                </Mui.MenuItem>
              ))}
            </Mui.TextField>
          </Mui.Box>

          <Mui.Box mb={2} >
            <Mui.Typography variant="h6" gutterBottom>
              Query Parameters
            </Mui.Typography>
            {queryParams.map((param, idx) => (
              <Mui.Grid container spacing={2} key={idx} sx={{ mb: 1 }}>
                <Mui.Box mb={2}>
                  <Mui.TextField
                    label="Key"
                    fullWidth
                    value={param.key}
                    onChange={(e) => handleQueryParamChange(idx, "key", e.target.value)}
                  />
                </Mui.Box>
                <Mui.Box mb={2}>
                  <Mui.TextField
                    label="Value"
                    fullWidth
                    value={param.value}
                    onChange={(e) => handleQueryParamChange(idx, "value", e.target.value)}
                  />
                </Mui.Box>
              </Mui.Grid>
            ))}
            <Mui.Button variant="outlined" onClick={addQueryParamField} sx={{ mt: 1 }}>
              + Add Query Param
            </Mui.Button>
          </Mui.Box>

          <Mui.Box mb={2}>
            <Mui.Typography variant="h6" gutterBottom>
              Headers
            </Mui.Typography>
            {headers.map((header, idx) => (
              <Mui.Grid container spacing={2} key={idx} sx={{ mb: 1 }}>
                <Mui.Box mb={2}>
                  <Mui.TextField
                    label="Key"
                    fullWidth
                    value={header.key}
                    onChange={(e) => handleHeaderChange(idx, "key", e.target.value)}
                  />
                </Mui.Box>
                <Mui.Box mb={2}>
                  <Mui.TextField
                    label="Value"
                    fullWidth
                    value={header.value}
                    onChange={(e) => handleHeaderChange(idx, "value", e.target.value)}
                  />
                </Mui.Box>
              </Mui.Grid>
            ))}
            <Mui.Button variant="outlined" onClick={addHeaderField} sx={{ mt: 1 }}>
              + Add Header
            </Mui.Button>
            <Mui.Box mb={2}>
            <Mui.Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={sendRequest}
              disabled={loading || !url}
              sx={{ mt: 2 }}
            >
              {loading ? "Sending..." : "Send Request"}
            </Mui.Button>
          </Mui.Box>
          </Mui.Box>

          {["POST", "PUT", "PATCH"].includes(method) && (
            <Mui.Box mb={2}>
              <Mui.Typography variant="h6" gutterBottom>
                Body (JSON)
              </Mui.Typography>
              <Mui.TextField
                fullWidth
                multiline
                minRows={4}
                placeholder='e.g. { "name": "John" }'
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </Mui.Box>
          )}
        </Mui.Grid>
      </Mui.Card>

      <Mui.Card>
        <Mui.CardContent>
          <Mui.Typography variant="h6" gutterBottom>
            📦 Response
          </Mui.Typography>
          {status !== null && (
            <Mui.Typography variant="body1" color="textSecondary">
              Status: {status} | Response Time: {responseTime?.toFixed(2)} ms
            </Mui.Typography>
          )}
          {error ? (
            <Mui.Typography color="error">{error}</Mui.Typography>
          ) : response ? (
            <>
              {renderJsonResponse()}
              {renderTable()}
            </>
          ) : (
            <Mui.Typography color="textSecondary">No response yet.</Mui.Typography>
          )}
        </Mui.CardContent>
      </Mui.Card>
    </Mui.Container>
  );
};

export default App;
