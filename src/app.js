import express from "express";
import { engine } from "express-handlebars";
import cors from "cors";
import upload from "./services/uploader.js";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import { authMiddleware } from "./utils.js";

//Iniciar
const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log("Servidor escuchando en: " + PORT);
});

export const io = new Server(server);

//Import class container
import Container from "./classes/container.js";
const container = new Container();
const admin = true;

app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//Import router
import routerProducts from "./router/productos.js";
import routerCart from "./router/cart.js";

//app.use(upload.single("file"));

//Configurar para indicar que products pueda recibir json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Public
app.use(express.static(__dirname + "/public"));
app.use(cors());

//Middleware manejo de errores
app.use((err, req, res, next) => {
  console.log(err.stack);
});

app.use((req, res, next) => {
  let timestamp = Date.now();
  let time = new Date(timestamp);
  console.log("Petición hecha a las: " + time.toTimeString().split(" ")[0]);
  req.auth = admin;
  next();
});

app.get("/", (req, res) => {
  res.send("Hola, este es el desafío 7");
});

//Middleware Routes
app.use("/api/products", routerProducts);
app.use("/api/cart", routerCart);

app.get("/api/productRandom", (req, res) => {
  try {
    container.getRandomProduct().then((result) => {
      let products = result.payload;
      console.log(products);
      if (result.status === "success") {
        console.log("RESULT", result);
        res.send(result.payload);
      } else {
        res.send(res.message);
      }
    });
  } catch (error) {
    res.send(res.message);
  }
});

//Se envía como un form data
app.post(
  "/api/uploadfile",
  upload.fields([
    {
      name: "file",
      maxCount: 1
    },
    {
      name: "documents",
      maxCount: 3
    }
  ]),
  (req, res) => {
    const files = req.files;
    console.log(files);
    if (!files || files.length === 0) {
      res.status(500).send({ messsage: "No se subió archivo" });
    }
    res.send(files);
  }
);

app.get("/view/products", authMiddleware, (req, res) => {
  container.getAll().then((result) => {
    let info = result.payload;
    let preparedObject = {
      products: info
    };
    res.render("products", preparedObject);
  });
});

//Socket
//ON => escuchador de eventos - lado del servidor
io.on("connection", async (socket) => {
  console.log(`El socket ${socket.id} se ha conectado`);
  let products = await container.getAll();

  //Mandar al cliente
  socket.emit("deliverProducts", products);
});

//CREATE CENTRO DE MENSAJES
let messages = [];

//On respuesta y emit => envío
io.on("connection", (socket) => {
  console.log("Cliente conectado");
  socket.emit("messagelog", messages);
  socket.emit("welcome", "BIENVENIDO A MI SOCKET");
  socket.on("message", (data) => {
    messages.push(data);
    io.emit("messagelog", messages);
  });
});
