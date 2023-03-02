const Bree = require("bree");
const bree = new Bree({
  jobs: [
    // runs the job on Start

    {
      name: "scraper1",
      // cron: "* * * * *",
      interval: 3,
      worker: {
        module: "./jobs/scraper1.js",
      },
      callback: (result) => {
        console.log(`Task completed with result: ${result}`);
      },
    },
  ],
});
bree.start();
