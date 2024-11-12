const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3311,
  multipleStatements: true, // Enable multiple statements in a query
  user: "root",
  password: "1234",
  database: "ProyectoF",
});

//Validacon de la conexión de la base de datos
connection.connect((error) => {
  if (error) {
    console.log("Error conectando con la base de datos", error);
    return;
  } else {
    console.log("Conexión exitosa con la base de datos");
  }
});

module.exports = connection;
