import fs from "fs";
import __dirname from "../utils.js";
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
        return { status: "success", message: "Carrito creado" };
      } catch (error) {
        return {
          status: "error",
          message: "No se pudo crear el carrito" + error
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
  async addProduct(id, product) {
    try {
      let data = await fs.promises.readFile(cartURL, "utf-8");
      data = JSON.parse(data);

      let index = data.findIndex((product) => product.id === id);
      let cart = data[index];
      let products = cart.products;
      if (products) {
        products.push(product);

        await fs.promises.writeFile(cartURL, JSON.stringify(data, null, 2));

        return {
          status: "Success",
          message: "Producto agregado",
          payload: products
        };
      } else {
        return {
          status: "error",
          message: "No se pudo añadir producto: " + error
        };
      }
    } catch (error) {
      return {
        status: "error",
        message: "No se pudo añadir el producto: " + error
      };
    }
  }

  async getProductsByCartId(id) {
    try {
      let data = await fs.promises.readFile(cartURL, "utf-8");
      data = JSON.parse(data);

      if (data.length > 0) {
        let index = data.findIndex((product) => product.id === id);
        console.log(index);
        let cart = data[index];

        let products = cart.products;
        return {
          status: "Success",
          message: "Producto encontrado",
          payload: products
        };
      } else {
        return {
          status: "Error",
          message: "No se encontró productos en el carrito: " + error
        };
      }
    } catch (error) {
      return {
        status: "Error",
        message: "No se encontró productos en el carrito:" + error
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
          return { status: "success", message: "Producto eliminado" };
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
        mesagge: "Carrito eliminado"
      };
    } catch (error) {
      return {
        status: "Error",
        message: "No se pudo eliminar el carrito " + error
      };
    }
  }
}

export default Carrito;
