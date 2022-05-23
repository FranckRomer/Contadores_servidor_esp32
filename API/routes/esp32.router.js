const express = require("express");
const { send } = require("express/lib/response");
const bodyParse = require('body-parser')
var MongoClient = require('mongodb').MongoClient;
//const res = require("express/lib/response");
// get the client
const mysql = require('mysql2');

var url = "mongodb://root:train@164.92.75.200:27017";


// create the connection to database
const connection = mysql.createConnection({
  host: '164.92.75.200',
  user: 'root',
  password: 'train',
  database: 'train',
  port: 3307
});

const router = express.Router();
router.use(express.json());
router.use(bodyParse.text());

let latitud_bd = "-98.2037";
let longitud_bd = "19.03392";
let respuesta_bd = "";

/******************
*    GET /HORA
* ***************** */
router.get('/hora', (req,res) => {
  console.log("---------------------------------")
  console.log("Se requiere la HORA");
  var hoy = new Date();
  var dia = hoy.getDate();
  var mes = hoy.getMonth() + 1;
  var ano = hoy.getFullYear();
  var hora = hoy.getHours();
  var minuto = hoy.getMinutes();
  var segundo = hoy.getSeconds();
  res.json({
    dia:dia,
    mes: mes,
    ano: ano,
    hora: hora,
    minuto:minuto,
    segundo:segundo
  });
  console.log("Solicitud de Hora: " + hoy)
});


/******************
*    GET /STATUS
* ***************** */
router.get('/status', (req,res) => {

  console.log("---------------------------------")
  console.log("Se requiere el STATUS SERVER");

  let status_bd ;
  connection.query(`select 1`,(error,
      results) => {
        if (error)  throw error;
        console.log(results);
        status_bd = 1
        res.json({
          longitud: longitud_bd,
          latitud: latitud_bd,
          status_server: 1,         // 1 = VIVO SERVER
          status_bd: status_bd,             // 1 = VIVO BD
          status_activo: 0,         // 1 = MATAR CONTADOR
          status_reset_values:0,    // 1 = RESETEA VALORES
          delete_sd: 0,             // 1 = elimina valores de sd
        });
      });
  //let status_bd = 1;

  
  status_bd = 0;
});

/******************
*    POST
* ***************** */

//------------------------------------------
//          REGISTRO_CONTEO
//------------------------------------------
router.post('/CONTADOR/REGISTRO_CONTEO',(req, res_api) => {
  const body = req.body;
  console.log("---------------------------------")
  console.log("Registro de CONTEOS");

  console.log(body);

  // connection.query(`INSERT INTO contador_reg_conteo (clase, id_dispositivo, status, tipo, evento, fecha_hora, latitud, longitud, cuenta_total_subidas,cuenta_total_bajadas, linea1_subidas, linea1_bajadas, linea2_subidas, linea2_bajadas, linea3_subidas, linea3_bajadas, ruta, unidad, ramal) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  // [body.clase, body.id_dispositivo, body.status, body.Tipo, body.Evento, body.Fecha_hora, body.latitud, body.longitud, body.Cuenta_total_subidas, body.Cuenta_total_bajadas , body.Linea1_cuenta_subidas, body.Linea1_cuenta_bajadas, body.Linea2_cuenta_subidas, body.Linea2_cuenta_bajadas, body.Linea3_cuenta_subidas, body.Linea3_cuenta_bajadas, body.ruta,body.unidad,body.ramal],(error,
  // results) => {
  //   if (error) return res.json({ error: error });
  //     //console.log(results.affectedRows);
  //     if(results.affectedRows > 0){
  //       //res.send(true);
  //     }
  // });

    // yo le dije a javiercito que pusiera status = 0 // no me acuerdo para que
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("train");
      dbo.collection("contador_reg_conteo").insertOne(body, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
        res_api.send(true);
      });
    });
  
  //res.send(true);
});

//------------------------------------------
//          REGISTRO_BLOQUEO
//------------------------------------------
router.post('/CONTADOR/REGISTRO_BLOQUEO',(req, res_api) => {
  console.log("---------------------------------")
  console.log("Registro de BLOQUEOS");
  const body = req.body;
  console.log(body);

  // connection.query(`INSERT INTO contador_reg_bloqueos (clase, id_dispositivo,status,tipo,elemento_bloqueado,evento,fecha_hora,sensor1_est_bloq,sensor2_est_bloq,sensor3_est_bloq,sensor4_est_bloq,sensor5_est_bloq,sensor6_est_bloq,lin1_est_bloq,lin2_est_bloq,lin3_est_bloq,bloqueo_total,ruta, unidad, ramal) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  // [body.clase,body.id_dispositivo,body.status,body.Tipo,body.Elemento_Bloqueado,body.Evento,body.Fecha_hora,body.Sensor_1_EstadoBloqueo,body.Sensor_2_EstadoBloqueo,body.Sensor_3_EstadoBloqueo,body.Sensor_4_EstadoBloqueo,body.Sensor_5_EstadoBloqueo,body.Sensor_6_EstadoBloqueo,body.Linea_1_EstadoBloqueo,body.Linea_2_EstadoBloqueo,body.Linea_3_EstadoBloqueo,body.Bloqueo_Total,body.ruta,body.unidad,body.ramal],(error,
  // results) => {
  //   if (error) return res.json({ error: error });
  //   console.log(results)
  //   if(results.affectedRows > 0){
  //       res.send(true);
  //   }
  //   });
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("train");
    dbo.collection("contador_reg_bloqueos").insertOne(body, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
      res_api.send(true);
    });
  });

});

/******************
*    PATCH
* ***************** */
router.patch('/gps',(req, res) => {
  const body = req.body;
  console.log(body);
  console.log("---------------------------------")
  console.log("ACTUALIZACION DE GPS")
  // ESCRIBIR EN BASE DE DATOS
  connection.query(`UPDATE gps_data SET
  longitud = "${body.longitud}",
  latitud = "${body.latitud}",
  status = "${1}"
  WHERE id = 1 `
  ,(error,
  results) => {
    if (error)  throw error;
    console.log(results.affectedRows + " record(s) updated");
    respuesta_bd = results.affectedRows
    });
  if(respuesta_bd){
    res.send("ACTUALIZADO GPS y GUARDADO EN BD");
  }

});


/******************
*    DELETE
* ***************** */
router.delete('/:id',(req, res) => {
  console.log("---------------------------------")
  const{id} = req.params;
  res.json({
    message: 'deleted',
    id,
  });
});

module.exports = router


// {
//   "clase": "contador",
//   "id_dispositivo": 3,
//   "status": 0,
//   "tipo": "REGISTRO_CONTEO",
//   "evento": "PRUEBA",
//   "fecha_hora": "1970-01-01 00:00:08",
//   "latitud": 2834,
//   "longitud": 2833,
//   "cuenta_total_bajadas": 1234,
//   "linea1_subidas": 2332,
//   "linea1_bajadas": 2332,
//   "linea2_subidas": 2332,
//   "linea2_bajadas": 2332,
//   "linea3_subidas": 2332,
//   "linea3_bajadas": 2332,
//   "ruta": '34A',
//   "unidad": 48,
//   "ramal": "Heroes"
// }




////////////////////////////////////
// connection.query('INSERT INTO gps_data (longitud, latitud, status, ruta, unidad, ramal) VALUES(?,?,?,?,?,?)',
//   [body.longitud, body.latitud, 1,body.ruta,body.unidad,body.ramal],(error,
//   results) => {
//     if (error) return res.json({ error: error });
//     });
