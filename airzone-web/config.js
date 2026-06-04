// config.js

const config = {
  airzone: {
    host: "192.168.1.150",
    port: 3000,
    systemID: 1,
    endpoint: "/api/v1/hvac"
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