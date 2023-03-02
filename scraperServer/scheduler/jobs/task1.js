const { parentPort } = require("worker_threads");

for (let i = 0; i < 100000; i++) {}

parentPort.postMessage("Task 1 completed");
