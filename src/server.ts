import express from "express";
import { router } from "./routes/routes";
import cors from "cors";
import path from "path";
import morganBody from "morgan-body";
import fs from "fs";

// import cors from "cors";

const app = express();

// // Configurando o CORS --------------------------------------------------------
// Adicionando a lista de IP's permitidos a acessar a API.
const allowedOrigins = ["http://192.168.6.20:3002", "http://localhost:3002", "http://192.168.6.20:3000", "http://localhost:3000"];

const options: cors.CorsOptions = {
    origin: allowedOrigins
};
app.use(cors(options));

// ---------------------------------------------------------------------------
// Permitindo o APP utilizar JSON ---------------------------------------------
app.use(express.json());

// Registrando logs -----------------------------------------------------------
const log = fs.createWriteStream(
  path.join(__dirname, "./logs", "express.log"), { flags: "a" }
);

morganBody(app, {
  noColors: true,
  stream: log
});

// Pasta aonde os uploads serão armazenados -----------------------------------
app.use("/files", express.static(path.resolve(__dirname, '..','uploads')))


app.use(router);

app.listen(3020, () => {
  console.log("Link Start! \u{1F60E} \u{1F44D}")
})