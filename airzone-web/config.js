// config.js

const config = {
  useMock: true,

  airzone: {
    host: "192.168.1.141",
    port: 3000,
    systemID: 1,
    masterZoneID: 1,
    endpoint: "/api/v1/hvac"
  },

  modes: {
    cold: 2,
    heat: 3
  },

  zones: {
    1: "Salon",
    2: "hab1",
    3: "hab2",
    4: "hab3"
  },

  server: {
    port: 3001
  }
};

module.exports = config;