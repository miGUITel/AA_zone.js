// public/app.js

let zones = [];
let selectedZone = null;

const zoneSelect = document.getElementById("zoneSelect");

const zoneName = document.getElementById("zoneName");
const zoneStatus = document.getElementById("zoneStatus");
const roomTemp = document.getElementById("roomTemp");
const setpoint = document.getElementById("setpoint");
const humidity = document.getElementById("humidity");
const demand = document.getElementById("demand");
const battery = document.getElementById("battery");
const coverage = document.getElementById("coverage");

const toggleButton = document.getElementById("toggleButton");
const decreaseButton = document.getElementById("decreaseButton");
const increaseButton = document.getElementById("increaseButton");

const message = document.getElementById("message");

// -------------------------
// Funciones de llamada a la API
// -------------------------

async function getZones() {
  const response = await fetch("/api/zones");

  if (!response.ok) {
    throw new Error("No se pudieron obtener las zonas");
  }

  return await response.json();
}

async function getZone(zoneID) {
  const response = await fetch(`/api/zones/${zoneID}`);

  if (!response.ok) {
    throw new Error(`No se pudo obtener la zona ${zoneID}`);
  }

  return await response.json();
}

async function setZoneOn(zoneID, on) {
  const response = await fetch(`/api/zones/${zoneID}/on`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ on })
  });

  if (!response.ok) {
    throw new Error(`No se pudo cambiar el estado de la zona ${zoneID}`);
  }

  return await response.json();
}

async function setZoneSetpoint(zoneID, newSetpoint) {
  const response = await fetch(`/api/zones/${zoneID}/setpoint`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ setpoint: newSetpoint })
  });

  if (!response.ok) {
    throw new Error(`No se pudo cambiar la consigna de la zona ${zoneID}`);
  }

  return await response.json();
}

// -------------------------
// Funciones de interfaz
// -------------------------

function showMessage(text, isError = false) {
  message.textContent = text;
  message.className = isError ? "error" : "ok";
}

function clearMessage() {
  message.textContent = "";
  message.className = "";
}

function getDemandText(zone) {
  if (!zone.on) {
    return "Zona apagada";
  }

  if (zone.coldDemand) {
    return "Demandando frío";
  }

  if (zone.heatDemand) {
    return "Demandando calor";
  }

  if (zone.airDemand) {
    return "Demandando aire";
  }

  return "Sin demanda";
}

function renderZone(zone) {
  selectedZone = zone;

  zoneName.textContent = zone.name;
  zoneStatus.textContent = zone.on ? "Encendida" : "Apagada";
  roomTemp.textContent = `${zone.roomTemp} ºC`;
  setpoint.textContent = `${zone.setpoint} ºC`;
  humidity.textContent = `${zone.humidity} %`;
  demand.textContent = getDemandText(zone);
  battery.textContent = `${zone.battery} %`;
  coverage.textContent = `${zone.coverage} %`;

  toggleButton.textContent = zone.on ? "Apagar zona" : "Encender zona";
}

function renderZoneOptions(zonesList) {
  zoneSelect.innerHTML = "";

  zonesList.forEach(zone => {
    const option = document.createElement("option");
    option.value = zone.id;
    option.textContent = zone.name;
    zoneSelect.appendChild(option);
  });
}

async function loadZones() {
  try {
    clearMessage();

    zones = await getZones();

    renderZoneOptions(zones);

    if (zones.length > 0) {
      renderZone(zones[0]);
      zoneSelect.value = zones[0].id;
    }

    showMessage("Zonas cargadas correctamente");
  } catch (error) {
    console.error(error);
    showMessage("Error al cargar las zonas", true);
  }
}

async function refreshSelectedZone() {
  if (!selectedZone) {
    return;
  }

  const updatedZone = await getZone(selectedZone.id);
  renderZone(updatedZone);
}

// -------------------------
// Eventos de usuario
// -------------------------

zoneSelect.addEventListener("change", async () => {
  try {
    clearMessage();

    const zoneID = Number(zoneSelect.value);
    const zone = await getZone(zoneID);

    renderZone(zone);
  } catch (error) {
    console.error(error);
    showMessage("Error al cambiar de zona", true);
  }
});

toggleButton.addEventListener("click", async () => {
  try {
    clearMessage();

    if (!selectedZone) {
      return;
    }

    const updatedZone = await setZoneOn(selectedZone.id, !selectedZone.on);
    renderZone(updatedZone);

    showMessage("Estado de la zona actualizado");
  } catch (error) {
    console.error(error);
    showMessage("Error al encender o apagar la zona", true);
  }
});

increaseButton.addEventListener("click", async () => {
  try {
    clearMessage();

    if (!selectedZone) {
      return;
    }

    const newSetpoint = selectedZone.setpoint + 0.5;
    const updatedZone = await setZoneSetpoint(selectedZone.id, newSetpoint);

    renderZone(updatedZone);
    showMessage("Consigna aumentada");
  } catch (error) {
    console.error(error);
    showMessage("Error al subir la consigna", true);
  }
});

decreaseButton.addEventListener("click", async () => {
  try {
    clearMessage();

    if (!selectedZone) {
      return;
    }

    const newSetpoint = selectedZone.setpoint - 0.5;
    const updatedZone = await setZoneSetpoint(selectedZone.id, newSetpoint);

    renderZone(updatedZone);
    showMessage("Consigna reducida");
  } catch (error) {
    console.error(error);
    showMessage("Error al bajar la consigna", true);
  }
});

// -------------------------
// Inicio de la aplicación
// -------------------------

loadZones();