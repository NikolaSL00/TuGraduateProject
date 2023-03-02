const Bree = require("bree");

const jobs = [
  {
    name: "task1",
    interval: "10s",
    timeout: "10s",
    worker: "./tasks/task1.js",
  },
  // {
  //   name: "task2",
  //   cron: "* * * * *", // every minute
  //   worker: "./tasks/task2.js",
  // },
];

function myWorkerMessageHandler(job) {
  if (job.message.error) {
    console.log("We got error");
  } else {
    console.log(
      `Received message from worker for job "${job.name}":`,
      job.message
    );
  }
}

const bree = new Bree({
  jobs,
  workerMessageHandler: myWorkerMessageHandler,
});

bree.start();
