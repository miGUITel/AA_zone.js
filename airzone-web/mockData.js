// mockData.js

const zones = [
  {
    id: 1,
    name: "Salon",
    on: true,
    setpoint: 25.5,
    roomTemp: 26.2,
    humidity: 51,
    mode: 2,
    speed: 0,
    airDemand: true,
    coldDemand: true,
    heatDemand: false,
    battery: 73,
    coverage: 99,
    errors: []
  },
  {
    id: 2,
    name: "hab1",
    on: true,
    setpoint: 25.5,
    roomTemp: 25.9,
    humidity: 51,
    mode: 2,
    speed: 0,
    airDemand: true,
    coldDemand: true,
    heatDemand: false,
    battery: 67,
    coverage: 99,
    errors: []
  },
  {
    id: 3,
    name: "hab2",
    on: false,
    setpoint: 25,
    roomTemp: 25.8,
    humidity: 59,
    mode: 2,
    speed: 0,
    airDemand: false,
    coldDemand: false,
    heatDemand: false,
    battery: 75,
    coverage: 99,
    errors: []
  },
  {
    id: 4,
    name: "hab3",
    on: false,
    setpoint: 25.5,
    roomTemp: 25.8,
    humidity: 53,
    mode: 2,
    speed: 0,
    airDemand: false,
    coldDemand: false,
    heatDemand: false,
    battery: 75,
    coverage: 99,
    errors: []
  }
];

module.exports = zones;