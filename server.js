const http = require("http");

const routes = {
  "/": { message: "Tiny JSON server is running." },
  "/hello": { message: "Hello from the server side of the request-response loop." },
  "/time": () => ({ now: new Date().toISOString() }),
};

const server = http.createServer((req, res) => {
  const path = new URL(req.url, `http://${req.headers.host}`).pathname;
  const data = routes[path];

  res.setHeader("Content-Type", "application/json");

  if (!data) {
    res.statusCode = 404;
    return res.end(JSON.stringify({ error: "Not found" }));
  }

  res.end(JSON.stringify(typeof data === "function" ? data() : data));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
