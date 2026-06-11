// mockClient.js

const zones = require("./mockData");

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function updateDemand(zone) {
  if (!zone.on) {
    zone.airDemand = false;
    zone.coldDemand = false;
    zone.heatDemand = false;
    return;
  }

  // Modo 2: frío
  if (zone.mode === 2) {
    zone.coldDemand = zone.roomTemp > zone.setpoint;
    zone.heatDemand = false;
    zone.airDemand = zone.coldDemand;
    return;
  }

  // Modo 3: calor
  if (zone.mode === 3) {
    zone.heatDemand = zone.roomTemp < zone.setpoint;
    zone.coldDemand = false;
    zone.airDemand = zone.heatDemand;
    return;
  }

  zone.airDemand = false;
  zone.coldDemand = false;
  zone.heatDemand = false;
}

async function getZones() {
  zones.forEach(updateDemand);
  return clone(zones);
}

async function getZone(zoneID) {
  const zone = zones.find(z => z.id === zoneID);

  if (!zone) {
    throw new Error(`No se encontró la zona con id ${zoneID}`);
  }

  updateDemand(zone);
  return clone(zone);
}

async function setZoneOn(zoneID, on) {
  const zone = zones.find(z => z.id === zoneID);

  if (!zone) {
    throw new Error(`No se encontró la zona con id ${zoneID}`);
  }

  zone.on = Boolean(on);
  updateDemand(zone);

  return clone(zone);
}

async function setZoneSetpoint(zoneID, setpoint) {
  const zone = zones.find(z => z.id === zoneID);

  if (!zone) {
    throw new Error(`No se encontró la zona con id ${zoneID}`);
  }

  if (typeof setpoint !== "number") {
    throw new Error("La consigna debe ser un número");
  }

  if (setpoint < 18 || setpoint > 30) {
    throw new Error("La consigna debe estar entre 18 y 30 ºC");
  }

  zone.setpoint = setpoint;
  updateDemand(zone);

  return clone(zone);
}

async function setMode(mode) {
  if (mode !== 2 && mode !== 3) {
    throw new Error("Modo no permitido. Usa 2 para frío o 3 para calor.");
  }

  zones.forEach(zone => {
    zone.mode = mode;
    updateDemand(zone);
  });

  return clone(zones);
}

module.exports = {
  getZones,
  getZone,
  setZoneOn,
  setZoneSetpoint,
  setMode
};