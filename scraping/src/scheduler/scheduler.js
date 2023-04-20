const Bree = require('bree');
const path = require('path');
const { sendEmail } = require('../services/emailService');
const { natsWrapper } = require('../nats-wrapper');
const {
  ScrapingStoreCompletedPublisher,
} = require('../events/publishers/scraping-store-completed-publisher');

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
      name: 'parkmartVarna',
      locations: [
        {
          country: 'Bulgaria',
          city: 'Varna',
          isPhysical: true,
          coordinates: {
            latitude: 12123123.1231,
            longitude: 123123123.123,
          },
        },
      ],
      // cron: '0 5,17 * * *', // runs the task twice a day at 5AM and 5 PM
      // timeout: 1200000, // 20 minutes
      interval: '60s',
      timeout: '6s',
      worker: `zasiti.js`,
      // interval: "5s",
    },
  ];

  function myWorkerMessageHandler(job) {
    job.message.error
      ? sendEmail({
          name: job.name,
          error: job.message.error,
        })
      : (() => {
          new ScrapingStoreCompletedPublisher(natsWrapper.client).publish({
            name: job.name,
            locations: job.locations,
            products: job.message.result,
          });
        })();
  }

  const bree = new Bree({
    root: `${path.dirname(require.main.filename)}/scheduler/jobs/`,
    jobs,
    workerMessageHandler: myWorkerMessageHandler,
  });

  bree.start();
};
