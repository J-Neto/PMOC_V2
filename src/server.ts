import express from "express";
import { router } from "./routes/routes";
import path from "path";

// import cors from "cors";

const app = express();

// // Configurando o CORS --------------------------------------------------------
// // Adicionando a lista de IP's permitidos a acessar a API.
// const allowedOrigins = ["http://localhost:53264/"];

// const options: cors.CorsOptions = {
//     origin: allowedOrigins
// };
// app.use(cors(options));

// ---------------------------------------------------------------------------

app.use(express.json());

// Pasta aonde os uploads serão armazenados -----------------------------------
app.use("/files", express.static(path.resolve(__dirname, '..','uploads')))


app.use(router);

app.listen(3020, () => {
  console.log("Link Start! \u{1F60E} \u{1F44D}")
})