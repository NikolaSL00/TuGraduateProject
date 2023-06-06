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
      name: "zasiti",
      // cron: '0 5,17 * * *', // runs the task twice a day at 5AM and 5 PM
      // timeout: 1200000, // 20 minutes
      interval: "60s",
      timeout: "25s",
      worker: `zasiti.js`,
      // interval: "5s",
    },
  ];

  function myWorkerMessageHandler(job) {

    console.log(job.message.error);
    if(job.message.error){
      console.log('error: ');
      console.log(job.name);
      console.log(job.message.error);
    } else {
      console.log('finished');
      console.log(job.name);
      console.log(job.message.locations);
      console.log(job.message.result);
    }
    

    job.message.error
      ? sendEmail({
          name: job.name,
          error: job.message.error,
        })
      : (() => {
        console.log('should send message');
         try{
          new ScrapingStoreCompletedPublisher(natsWrapper.client).publish({
            name: job.name,
            locations: job.message.locations,
            products: job.message.result,
          });
         }catch(err){
          console.log(err);
         }
          console.log('message sent!');
        })();
  }

  const bree = new Bree({
    root: `${path.dirname(require.main.filename)}/scheduler/jobs/`,
    jobs,
    workerMessageHandler: myWorkerMessageHandler,
  });

  bree.start();
};
