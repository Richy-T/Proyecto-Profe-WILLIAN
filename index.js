const express = require("express");
const connection = require("./db");
const path = require("path");

const app = express();

// Encargado de parsear a los json

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Archivos html
app.use(express.static(path.join(__dirname, "templates")));

//Ruta prueba

/*
app.get('api/prueba', (req, res)=>{

    res.send('Api funcionando de manera correcta');
});
*/

// Prueba 1

app.get("/api/prueba1", (req, res) => {
  res.status(200).json({
    message: "la api responde correctamente",
    port: PORT,
    status: "success",
  });
});

// Crear registro en persona.

app.post("/api/guardar", (req, res) => {
  //construyenco la persona
  const { Cedula, Nombre, Edad, Profesion } = req.body;

  //la constante que tendra el registro
  const query =
    "INSERT INTO persona (Cedula, Nombre, Edad, Profesion) VALUES (?,?,?,?)";
  connection.query(
    query,
    [Cedula, Nombre, Edad, Profesion],
    (error, result) => {
      if (error) {
        res.status(500).json({ error });
      } else {
        res
          .status(201)
          .json({ Cedula: result.insertId, Cedula, Nombre, Edad, Profesion });
      }
    }
  );
});

// obtener los registros de la base de datos

app.get("/api/obtener", (req, res) => {
  const query = "select * from persona";
  connection.query(query, (error, result) => {
    if (error) {
      res.status(500).json({
        success: false,
        message: "Error al recuperar los datos",
        details: error.message,
      });
    } else {
      res.status(200).json({
        success: true, //clave y valor
        message: "Datos de la tabla",
        data: result,
      });
    }
  });
});

// Appi para eliminar registros

app.delete("/api/eliminar/:cedula", (req, res) => {
  const { cedula } = req.params;
  const query = "DELETE FROM persona WHERE cedula = ?";
  connection.query(query, [cedula], (error, result) => {
    if (error) {
      res.status(500).json({
        success: false,
        message: "Error al Eliminar el registro",
        details: error.message,
      });
    } else if (result.affectedRows === 0) {
      res.status(404).json({
        success: false,
        message: `No existe el registro ${cedula}`,
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Dato eliminado de la tabla",
        data: result,
      });
    }
  });
});

// Actualizar los datos de un registro
// Se utilizo COALESCE funcion que se usa para pasar  valores, si hay algun valor null, mantieneel valor eistente en el campo
app.put("/api/persona/:cedula", (req, res) => {
  const query = ` UPDATE persona 
    SET 
        nombre = COALESCE(?, nombre), 
        edad = COALESCE(?, edad), 
        profesion = COALESCE(?, profesion) 
        WHERE cedula = ? 
        `;

  // const {cedula}= req.params;
  // const {Nombre, Edad, Profesion} = req.body;
  // const query = 'UPDATE persona SET Nombre = ?, Edad = ?, Profesion = ? WHERE cedula = ?';

  connection.query(
    query,
    [Nombre, Edad, Profesion, cedula],
    (error, result) => {
      if (error) {
        res.status(500).json({
          success: false,
          message: "Error al actualizar",
          details: error.message,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Persona Actualizada",
          // data:result
        });
      }
    }
  );
});

// Puerto de Conexión del servidor

const PORT = 3000;

app.listen(PORT, () => {
  console.log("Servidor Corriendo");
});
