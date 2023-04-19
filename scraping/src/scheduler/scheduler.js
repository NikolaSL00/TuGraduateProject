const Bree = require('bree');
const path = require('path');
// const { sendResult } = require('../services/requestService');
const { sendEmail } = require('../services/emailService');

export const scheduler = () => {
  const jobs = [
    {
      name: 'ebag',
      // cron: '0 5,17 * * *', // runs the task twice a day at 5AM and 5 PM
      // timeout: 1200000, // 20 minutes
      interval: '60s',
      timeout: '6s',
      worker: `ebag.js`,
      // interval: "5s",
    },
  ];

  function myWorkerMessageHandler(job) {
    // job.message.error
    //   ? sendEmail({
    //       name: job.name,
    //       error: job.message.error,
    //     })
    //   : sendResult({
    //       name: job.name,
    //       result: job.message.result,
    //     });
  }

  const bree = new Bree({
    root: `${path.dirname(require.main.filename)}/scheduler/jobs/`,
    jobs,
    workerMessageHandler: myWorkerMessageHandler,
  });

  bree.start();
};