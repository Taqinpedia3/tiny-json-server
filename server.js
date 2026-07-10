const http = require("http");
const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function send(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

async function body(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString() || "{}");
}

const server = http.createServer(async (req, res) => {
  const path = new URL(req.url, `http://${req.headers.host}`).pathname;

  try {
    if (req.method === "GET" && path === "/health") {
      const { rows } = await pool.query("select now()");
      return send(res, 200, { ok: true, databaseTime: rows[0].now });
    }

    if (req.method === "GET" && path === "/items") {
      const { rows } = await pool.query("select * from items order by id");
      return send(res, 200, rows);
    }

    if (req.method === "POST" && path === "/items") {
      const { name = "demo row" } = await body(req);
      const { rows } = await pool.query("insert into items(name) values($1) returning *", [name]);
      return send(res, 201, rows[0]);
    }

    send(res, 404, { error: "Not found" });
  } catch (error) {
    send(res, 500, { error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
