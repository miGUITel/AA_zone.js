// server.js

const express = require("express");
const path = require("path");

const config = require("./config");

const airzoneClient = config.useMock
  ? require("./mockClient")
  : require("./airzoneClient");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/zones", async (req, res) => {
  try {
    const zones = await airzoneClient.getZones();
    res.json(zones);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "No se pudo leer el estado de las zonas"
    });
  }
});

app.get("/api/zones/:id", async (req, res) => {
  try {
    const zoneID = Number(req.params.id);
    const zone = await airzoneClient.getZone(zoneID);
    res.json(zone);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "No se pudo leer el estado de la zona"
    });
  }
});

app.put("/api/zones/:id/on", async (req, res) => {
  try {
    const zoneID = Number(req.params.id);
    const { on } = req.body;

    await airzoneClient.setZoneOn(zoneID, Boolean(on));

    const updatedZone = await airzoneClient.getZone(zoneID);
    res.json(updatedZone);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "No se pudo cambiar el estado de la zona"
    });
  }
});

app.put("/api/zones/:id/setpoint", async (req, res) => {
  try {
    const zoneID = Number(req.params.id);
    const { setpoint } = req.body;

    if (typeof setpoint !== "number") {
      return res.status(400).json({
        error: "La consigna debe ser un número"
      });
    }

    await airzoneClient.setZoneSetpoint(zoneID, setpoint);

    const updatedZone = await airzoneClient.getZone(zoneID);
    res.json(updatedZone);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "No se pudo cambiar la consigna"
    });
  }
});

app.listen(config.server.port, () => {
  console.log(`Servidor iniciado en http://localhost:${config.server.port}`);

  if (config.useMock) {
    console.log("Modo actual: MOCK - usando datos simulados");
  } else {
    console.log("Modo actual: REAL - conectado a Airzone");
  }
});