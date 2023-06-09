const Bree = require("bree");
const path = require("path");
const { sendEmail } = require("../services/emailService");
const { natsWrapper } = require("../nats-wrapper");
const {
  ScrapingStoreCompletedPublisher,
} = require("../events/publishers/scraping-store-completed-publisher");

export const scheduler = () => {
  const jobs = [
    {
      // name: 'zasiti',
      // location: [
      //   {
      //     country: 'Bulgaria',
      //     city: 'Varna',
      //     isPhysical: false,
      //   },
      //   {
      //     country: 'Bulgaria',
      //     city: 'Burgas',
      //     isPhysical: false,
      //   },
      // ],
      name: "shopGladen",
      // cron: '0 5,17 * * *', // runs the task twice a day at 5AM and 5 PM
      // timeout: 1200000, // 20 minutes
      interval: "60s",
      timeout: "25s",
      worker: `shopGladen.js`,
      // interval: "5s",  
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
