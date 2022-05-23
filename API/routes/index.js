const express = require("express");

const esp32Router = require("./esp32.router")

function routerAPI(app){
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/esp32', esp32Router);

}

module.exports = routerAPI;

