// airzoneClient.js

const config = require("./config");

const AIRZONE_URL = `http://${config.airzone.host}:${config.airzone.port}${config.airzone.endpoint}`;

async function requestAirzone(method, body) {
  const response = await fetch(AIRZONE_URL, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`Error Airzone: ${response.status} ${response.statusText} - ${text}`);
  }

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return {
      rawResponse: text
    };
  }
}

async function getZones() {
  const data = await requestAirzone("POST", {
    systemID: 0,
    zoneID: 0
  });

  return data.systems[0].data.map(zone => ({
    id: zone.zoneID,
    name: config.zones[zone.zoneID] ?? zone.name,
    originalName: zone.name,
    on: zone.on === 1,
    setpoint: zone.setpoint,
    roomTemp: zone.roomTemp,
    humidity: zone.humidity,
    mode: zone.mode,
    speed: zone.speed,
    airDemand: zone.air_demand === 1,
    coldDemand: zone.cold_demand === 1,
    heatDemand: zone.heat_demand === 1,
    battery: zone.battery,
    coverage: zone.coverage,
    errors: zone.errors
  }));
}

async function getZone(zoneID) {
  const zones = await getZones();

  const zone = zones.find(z => z.id === zoneID);

  if (!zone) {
    throw new Error(`No se encontró la zona con id ${zoneID}`);
  }

  return zone;
}

async function setZoneOn(zoneID, on) {
  return await requestAirzone("PUT", {
    systemID: config.airzone.systemID,
    zoneID,
    on: on ? 1 : 0
  });
}

async function setZoneSetpoint(zoneID, setpoint) {
  return await requestAirzone("PUT", {
    systemID: config.airzone.systemID,
    zoneID,
    setpoint
  });
}

module.exports = {
  getZones,
  getZone,
  setZoneOn,
  setZoneSetpoint
};