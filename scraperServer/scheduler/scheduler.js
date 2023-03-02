const Bree = require("bree");

const scheduler = () => {
  const jobs = [
    {
      name: "task1",
      cron: "0 5,17 * * *", // runs the task twice a day at 5AM and 5 PM
      timeout: 1200000, // 20 minutes
      worker: "./tasks/task1.js",
      // interval: "5s",
    },
  ];

  function myWorkerMessageHandler(job) {
    if (job.message.error) {
      console.log(`We got error in ${job.name}`);
    } else {
      console.log(
        `Received message from worker for job "${job.name}":`,
        job.message
      );
    }
  }

  const bree = new Bree({
    root: "../scraperServer/scheduler/jobs",
    jobs,
    workerMessageHandler: myWorkerMessageHandler,
  });

  bree.start();
};

exports.scheduler = scheduler;
