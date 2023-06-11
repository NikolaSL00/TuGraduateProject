const Bree = require("bree");
const path = require("path");
const { sendEmail } = require("../services/emailService");
const { natsWrapper } = require("../nats-wrapper");
const {
  ScrapingStoreCompletedPublisher,
} = require("../events/publishers/scraping-store-completed-publisher");

export const scheduler = () => {
  const jobs = [
    // it will wait the previous job to finish and it will start the next job
    // so it starts from 1AM untill all jobs are finished
    // same thing at 1PM ...
    {
      name: "minamart",
      cron: "0 1,13 * * *", // runs the task twice a day at 1AM and 1PM
      worker: `minamart.js`,
    },
    {
      name: "gastronom",
      cron: "0 1,13 * * *", // runs the task twice a day at 1AM and 1PM
      worker: `gastronom.js`,
    },
    {
      name: "shopGladen",
      cron: "0 1,13 * * *", // runs the task twice a day at 1AM and 1PM
      worker: `shopGladen.js`,
    },
    {
      name: "ebag",
      cron: "0 1,13 * * *", // runs the task twice a day at 1AM and 1PM
      worker: `ebag.js`,
    },
    {
      name: "parkmartSofia",
      cron: "0 1,13 * * *", // runs the task twice a day at 1AM and 1PM
      worker: `parkmartSofia.js`,
    },
    {
      name: "parkmartVarna",
      cron: "0 1,13 * * *", // runs the task twice a day at 1AM and 1PM
      worker: `parkmartVarna.js`,
    },
    {
      name: "parkmartBurgas",
      cron: "0 1,13 * * *", // runs the task twice a day at 1AM and 1PM
      worker: `parkmartBurgas.js`,
    },
    {
      name: "zasiti",
      cron: "0 1,13 * * *", // runs the task twice a day at 1AM and 1PM
      worker: `zasiti.js`,
    }
  ];

  function myWorkerMessageHandler(job) {
    console.log("In myWorkerMessageHandler");

    if (job.message.error) {
      console.log("error: ");
      console.log(job.name);
      console.log(job.message.error);
    } else {
      console.log("finished in else");
      console.log(job.name);
      console.log(job.message.locations);
      console.log(job.message.result.length);
    }

    console.log(job.message.result.length);

    job.message.error
      ? sendEmail({
          name: job.name,
          error: job.message.error,
        })
      : (() => {
          try {
            new ScrapingStoreCompletedPublisher(natsWrapper.client).publish({
              name: job.name,
              locations: job.message.locations,
              products: job.message.result,
            });
          } catch (err) {
            console.log(err);
          }
          console.log("after sending event");
        })();
  }

  const bree = new Bree({
    root: `${path.dirname(require.main.filename)}/scheduler/jobs/`,
    jobs,
    workerMessageHandler: myWorkerMessageHandler,
  });

  bree.start();
};
