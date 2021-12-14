import express from "express";
import Carrito from "../classes/carrito.js";
const carrito = new Carrito();
const router = express.Router();

//Get products with id cart
router.get("/:cid/products", (req, res) => {
  let id = parseInt(req.params.cid);
  carrito.getProductsByCartId(id).then((result) => {
    res.send(result);
  });
});

//Create a cart
router.post("/", (req, res) => {
  carrito.create().then((result) => {
    res.send(result);
  });
});

//Add product to cart by cart id
//Enviar el producto por el body
router.post("/:cid/products", (req, res) => {
  let id = parseInt(req.params.cid);
  let product = req.body;
  console.log(product);
  carrito.addProduct(id, product).then((result) => {
    res.send(result);
  });
});

//Delete cart by id
router.delete("/:pid", (req, res) => {
  let id = parseInt(req.params.pid);
  carrito.deleteCartById(id).then((result) => {
    res.send(result);
  });
});

//Delete product by cart id and product id (the first id is for cart id and then product id)
router.delete("/:pid/products/:pid_prod", (req, res) => {
  let idCart = parseInt(req.params.pid);
  let idProduct = parseInt(req.params.pid_prod);
  carrito.deleteProductById(idCart, idProduct).then((result) => {
    res.send(result);
  });
});

router.get("*", (req, res) => {
  res.status(404).send("La página buscada no existe");
});

export default router;
