const Bree = require("bree");

const jobs = [
  {
    name: "task1",
    interval: "5s",
    timeout: "2s",
    worker: "./tasks/task1.js",
  },
  // {
  //   name: "task2",
  //   cron: "* * * * *", // every minute
  //   worker: "./tasks/task2.js",
  // },
];

function myWorkerMessageHandler(job) {
  console.log(
    `Received message from worker for job "${job.name}":`,
    job.message
  );
}

const bree = new Bree({
  jobs,
  workerMessageHandler: myWorkerMessageHandler,
});

bree.start();
