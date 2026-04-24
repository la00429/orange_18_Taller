const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "mzeosp",
  allowCypressEnv: false,
  

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
