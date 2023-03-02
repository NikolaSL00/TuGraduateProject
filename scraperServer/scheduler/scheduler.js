const Bree = require("bree");
const { sendResult } = require("../services/requestService");
const { sendEmail } = require("../services/emailService");

const scheduler = () => {
  const jobs = [
    {
      name: "task1",
      // cron: "0 5,17 * * *", // runs the task twice a day at 5AM and 5 PM
      // timeout: 1200000, // 20 minutes
      interval: "10s",
      timeout: "5s",
      worker: "./tasks/task1.js",
      // interval: "5s",
    },
  ];

  function myWorkerMessageHandler(job) {
    job.message.error
      ? sendEmail({
          name: job.name,
          error: job.message.error,
        })
      : sendResult({
          name: job.name,
          result: job.message.result,
        });
  }

  const bree = new Bree({
    root: "../scraperServer/scheduler/jobs",
    jobs,
    workerMessageHandler: myWorkerMessageHandler,
  });

  bree.start();
};

exports.scheduler = scheduler;
