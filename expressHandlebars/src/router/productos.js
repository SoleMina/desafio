import express from "express";
import upload from "../services/uploader.js";
import Container from "../classes/container.js";
import { io } from "../app.js";
import { authMiddleware } from "../utils.js";

const container = new Container();
const router = express.Router();
const admin = true;

//GETS
router.get("/", authMiddleware, (req, res) => {
  console.log(req.query);
  const status = req.query;

  container.getAll().then((result) => {
    if (result.status === "success") {
      res.status(200).send(result.payload);
    } else {
      res.status(500).send(result.message);
    }
  });
});

router.get("/:pid", (req, res) => {
  let id = parseInt(req.params.pid);
  container.getById(id).then((result) => {
    console.log(result);
    res.send(result);
  });
});

//POSTS
router.post("/", authMiddleware, upload.single("image"), (req, res) => {
  let file = req.file;
  let product = req.body;
  product.thumbnail =
    req.protocol + "://" + req.hostname + ":8080" + "/images/" + file.filename;
  //req.protocol +"://" + req.hostname + ":8080" + "/resources/images/" + file.filename;

  container.save(product).then((result) => {
    res.send(result);

    if (result.status === "success") {
      container.getAll().then((result) => {
        io.emit("deliverProducts", result);
      });
    }
  });
});

//PUTS
router.put("/:pid", authMiddleware, (req, res) => {
  let id = parseInt(req.params.pid);
  let body = req.body;
  container.updateProduct(id, body).then((result) => {
    res.send(result);
  });
});

//DELETES
router.delete("/:pid", authMiddleware, (req, res) => {
  let id = parseInt(req.params.pid);
  container.deleteById(id).then((result) => {
    res.send(result);
  });
});

export default router;
