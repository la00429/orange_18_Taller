const { defineConfig } = require("cypress");

module.exports = defineConfig({
    projectId: "mzeosp",
    video: true,
    screenshotOnRunFailure: true,
    e2e: {
        retries: {
            runMode: 1,
            openMode: 0
        },
    },
});