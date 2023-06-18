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
      cron: "0 0,12 * * *", // starts at 9 AM and 9 PM
      worker: `minamart.js`,
    },
    {
      name: "gastronom",
      cron: "0 1,13 * * *", // starts at 10 AM and 10 PM
      worker: `gastronom.js`,
    },
    {
      name: "shopGladen",
      cron: "0 2,14 * * *", // starts at 11 AM and 11 PM
      worker: `shopGladen.js`,
    },
    {
      name: "ebag",
      cron: "0 4,16 * * *", // starts at 1 AM and 1 PM
      worker: `ebag.js`,
    },
    {
      name: "parkmartSofia",
      cron: "0 6,18 * * *", // starts at 3 AM and 3 PM
      worker: `parkmartSofia.js`,
    },
    {
      name: "parkmartVarna",
      cron: "0 8,20 * * *", // starts at 5 AM and 5 PM
      worker: `parkmartVarna.js`,
    },
    {
      name: "parkmartBurgas",
      cron: "0 10,22 * * *", // starts at 7 AM and 7 PM
      worker: `parkmartBurgas.js`,
    },
    {
      name: "zasiti",
      cron: "0 11,23 * * *", // starts at 8 AM and 8 PM
      worker: `zasiti.js`,
    },
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
