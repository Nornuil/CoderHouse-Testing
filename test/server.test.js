const axios = require("axios");
const assert = require("assert");
const crearServidor = require("../index");
let server;

async function conectar({ port = 0 }) {
  return new Promise((resolve, reject) => {
    try {
      server = crearServidor(port);
      resolve(port);
    } catch (error) {
      reject(error);
    }
  });
}

describe("servidor Mongo", () => {
  const url = "http://localhost:3000";
  const username = "wallace223@hotmail.com";
  const password = "12345";

  before(async () => {
    await conectar({ port: 3000 });
  });

  describe("LOGIN", () => {
    describe("API GET /login", () => {
      it("deberia loguear al usuario y obtener el token", async () => {
        const { data } = await axios.post(url + "/login", {
          email: username,
          password: password,
        });
        assert.ok(data);
      });
    });
  });

  describe("PRODUCTOS", () => {
    describe("API GET api/productos", () => {
      it("deberia devolver todos los productos", async () => {
        const { status } = await axios.get(url + "/api/products");
        assert.strictEqual(status, 200);
      });
    });
  });
});
