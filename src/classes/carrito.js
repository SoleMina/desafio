import fs from "fs";
import __dirname from "../utils.js";
import Container from "./container.js";
const container = new Container();

const productURL = __dirname + "/files/productos.txt";
const cartURL = __dirname + "/files/carrito.txt";

class Carrito {
  async create() {
    try {
      let data = await fs.promises.readFile(cartURL, "utf-8");
      let products = JSON.parse(data);

      if (products.length > 0) {
        //Time
        const timestamp = Date.now();
        const time = new Date(timestamp);
        const carritoTime = time.toTimeString().split(" ")[0];
        let dataObj = {
          id: products.length + 1,
          timestamp: carritoTime,
          products: []
        };
        products.push(dataObj);
      }

      try {
        await fs.promises.writeFile(cartURL, JSON.stringify(products, null, 2));
        return { status: "success", message: "Producto creado" };
      } catch (error) {
        return {
          status: "error",
          message: "No se pudo crear el producto" + error
        };
      }
    } catch {
      //Time
      const timestamp = Date.now();
      const time = new Date(timestamp);
      const carritoTime = time.toTimeString().split(" ")[0];
      let dataObj = {
        id: 1,
        timestamp: carritoTime,
        products: []
      };

      try {
        await fs.promises.writeFile(
          cartURL,
          JSON.stringify([dataObj], null, 2)
        );
        return { status: "success", message: "Carrito creado con éxito" };
      } catch (error) {
        return {
          status: "error",
          message: "No se pudo crear el carrito: " + error
        };
      }
    }
  }
  async addProduct(id) {
    try {
      let dataProduct = await fs.promises.readFile(productURL, "utf-8");
      let products = JSON.parse(dataProduct);
      console.log("PRODUCT", products);
      console.log("id", id);

      //filter devuelve array, por eso usamos find ya que devuelve el valor como tal, en este caso objeto
      let product = products.find((product) => product.id == id);
      if (products.length > 0) {
        if (product) {
          let data = await fs.promises.readFile(cartURL, "utf-8");
          data = JSON.parse(data);
          console.log(id);
          data[0].products = [...data[0].products, product];
          try {
            await fs.promises.writeFile(cartURL, JSON.stringify(data, null, 2));
            return {
              status: "success",
              message: "Producto creado",
              payload: product
            };
          } catch (error) {
            return {
              status: "error",
              message: "No se pudo crear el productoooo"
            };
          }
        } else {
          return {
            status: "error",
            product: null,
            message: "Producto no encontrado1"
          };
        }
      } else {
        return {
          status: "error",
          product: null,
          message: "Producto no encontrado2"
        };
      }
    } catch (error) {
      return {
        status: "error",
        message: "No se pudo crear el carrito: " + error
      };
    }
  }

  async getAllProducts() {
    try {
      let data = await fs.promises.readFile(cartURL, "utf-8");
      data = JSON.parse(data);
      let products = data[0].products;
      console.log("EPPP", products);
      return {
        status: "success",
        message: "Productos encontrados",
        payload: products
      };
    } catch (error) {
      return {
        status: "Error",
        message: "No se encontró los productos" + error
      };
    }
  }
  async getProductById(id) {
    try {
      let data = await fs.promises.readFile(cartURL, "utf-8");
      data = JSON.parse(data);
      let products = data[0].products;
      console.log(products);

      let pid = parseInt(id);

      //filter devuelve array, por eso usamos find ya que devuelve el valor como tal, en este caso objeto
      let index = products.findIndex((product) => product.id === pid);
      let productSelected = products[index];
      if (products.length > 0) {
        if (productSelected) {
          return { status: "success", payload: productSelected };
        } else {
          return {
            status: "error",
            product: null,
            message: "Producto no encontrado"
          };
        }
      } else {
        return {
          status: "error",
          product: null,
          message: "Producto no encontrado"
        };
      }
    } catch (error) {
      return {
        status: "Error",
        message: "No se encontró el producto " + error
      };
    }
  }
  async deleteProductById(idCart, idProduct) {
    try {
      let data = await fs.promises.readFile(cartURL, "utf-8");
      data = JSON.parse(data);

      //Get object
      let dataResult = data.find((product) => product.id === idCart);
      let products = dataResult.products;

      let productsResult = products.filter(
        (product) => product.id !== idProduct
      );
      data[idCart - 1].products = productsResult;

      if (data.length > 0) {
        if (productsResult) {
          await fs.promises.writeFile(cartURL, JSON.stringify(data, null, 2));
          return { status: "success", payload: productsResult };
        } else {
          return {
            status: "error",
            product: null,
            message: "Producto eliminado"
          };
        }
      } else {
        return {
          status: "error",
          product: null,
          message: "Producto no eliminado"
        };
      }
    } catch (error) {
      return {
        status: "Error",
        message: "No se pudo eliminar el producto " + error
      };
    }
  }
  async deleteCartById(id) {
    try {
      let data = await fs.promises.readFile(cartURL, "utf-8");
      data = JSON.parse(data);

      let result = data.filter((product) => product.id !== id);
      await fs.promises.writeFile(cartURL, JSON.stringify(result, null, 2));
      return {
        status: "success",
        mesagge: "Producto eliminado",
        payload: result
      };
    } catch (error) {
      return {
        status: "Error",
        message: "No se pudo eliminar el producto " + error
      };
    }
  }
}

export default Carrito;
