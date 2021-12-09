import fs from "fs";
import __dirname from "../utils.js";

const productURL = __dirname + "/files/productos.txt";

class Container {
  async save(product) {
    try {
      let data = await fs.promises.readFile(productURL, "utf-8");
      let products = JSON.parse(data);
      console.log("PRODUCTS", products);
      const timestamp = Date.now();
      const time = new Date(timestamp);
      const productTime = time.toTimeString().split(" ")[0];

      if (products.some((pro) => pro.title === product.title)) {
        return { status: "error", message: "El producto ya existe" };
      } else {
        const price = parseFloat(product.price);
        const stock = parseInt(product.stock);
        let dataObj = {
          title: product.title,
          description: product.description,
          price: price,
          thumbnail: product.thumbnail,
          codigo: product.codigo,
          stock: stock,
          timestamp: productTime,
          id: products.length + 1
        };
        products = [...products, dataObj];

        try {
          await fs.promises.writeFile(
            productURL,
            JSON.stringify(products, null, 2)
          );
          return { status: "success", message: "Producto creado" };
        } catch (error) {
          return { status: "error", message: "No se pudo crear el producto" };
        }
      }
    } catch (error) {
      const timestamp = Date.now();
      const time = new Date(timestamp);
      const productTime = time.toTimeString().split(" ")[0];
      //El archivo no existe
      let dataObj = {
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        codigo: product.codigo,
        stock: product.stock,
        timestamp: productTime,
        id: 1
      };

      try {
        await fs.promises.writeFile(
          productURL,
          JSON.stringify([dataObj], null, 2)
        );
        return { status: "success", message: "Producto creado con éxito" };
      } catch (error) {
        return {
          status: "error",
          message: "No se pudo crear el producto: " + error
        };
      }
    }
  }
  async getById(id) {
    try {
      let data = await fs.promises.readFile(productURL, "utf-8");
      let products = JSON.parse(data);
      //filter devuelve array, por eso usamos find ya que devuelve el valor como tal, en este caso objeto
      let product = products.find((product) => product.id === id);
      if (products.length > 0) {
        if (product) {
          return { status: "success", payload: product };
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
  async getAll() {
    try {
      let data = await fs.promises.readFile(productURL, "utf-8");
      let products = JSON.parse(data);
      console.log(products);
      return {
        status: "success",
        message: "Productos encontrados",
        payload: products
      };
    } catch (error) {
      return {
        status: "Error",
        message: "No se encontró los productos"
      };
    }
  }
  async deleteById(id) {
    try {
      //Read file to get products array and delete the product by Id
      let data = await fs.promises.readFile(productURL, "utf-8");
      let products = JSON.parse(data);
      let result = products.filter((product) => product.id !== id);
      products = result;

      //Write the file with the new array
      await fs.promises.writeFile(
        productURL,
        JSON.stringify(products, null, 2)
      );
      return { status: "success", message: "Producto eliminado" };
    } catch (error) {
      return {
        status: "Error",
        message: "No se encontró el producto " + error
      };
    }
  }

  async deleteAll() {
    try {
      await fs.promises.writeFile(productURL, JSON.stringify([]));

      return { status: "success", mesagge: "Productos eliminados" };
    } catch (error) {
      return {
        status: "Error",
        message: "No se pudo eliminar los productos " + error
      };
    }
  }
  async getRandomProduct() {
    try {
      let data = await fs.promises.readFile(productURL, "utf-8");
      let products = JSON.parse(data);
      let randomNumber = Math.floor(Math.random() * products.length);
      console.log("RANDOM", randomNumber);
      let randomProduct = products[randomNumber];
      return {
        status: "success",
        message: "Producto encontrado",
        payload: randomProduct
      };
    } catch (error) {
      return {
        status: "Error",
        message: "No se pudo encontrar el producto" + error
      };
    }
  }
  async updateProduct(id, body) {
    try {
      let data = await fs.promises.readFile(productURL, "utf-8");
      let products = JSON.parse(data);
      if (!products.some((product) => product.id === id))
        return {
          status: "error",
          message: "No hay productos con el id especificado"
        };

      let result = products.map((product) => {
        if (product.id === id) {
          body = Object.assign(body);
          body = Object.assign({ id: product.id, ...body });
          return body;
        } else {
          return product;
        }
      });
      try {
        await fs.promises.writeFile(
          productURL,
          JSON.stringify(result, null, 2)
        );
        return { status: "success", message: "Producto actualizado" };
      } catch {
        return { status: "error", message: "Error al actualizar producto" };
      }
    } catch (error) {
      return { status: "error", message: "Fallo al actualizar producto" };
    }
  }
}

export default Container;
