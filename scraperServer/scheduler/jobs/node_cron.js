const cron = require("node-cron");

function myJob() {
  return new Promise((resolve, reject) => {
    // Perform some long-running operation here...
    const result = "Task1 completed successfully.";
    resolve(result);
  });
}
function myJob2() {
  return new Promise((resolve, reject) => {
    // Perform some long-running operation here...
    const result = "Task2 completed successfully.";
    resolve(result);
  });
}
cron.schedule("*/3 * * * * *", () => {
  myJob()
    .then((result) => {
      console.log(`Job result: ${result}`);
    })
    .catch((err) => {
      console.error(`Job error: ${err}`);
    })
    .then(
      myJob2()
        .then((result) => {
          console.log(`Job result: ${result}`);
        })
        .catch((err) => {
          console.error(`Job error: ${err}`);
        })
    );
});
