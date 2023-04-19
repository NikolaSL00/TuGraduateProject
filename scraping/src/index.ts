import { app } from './app';
import { scheduler } from './scheduler/scheduler';

const start = async () => {
  app.listen(3000, () => {
    console.log('Listening on port 3000...');
  });
  scheduler();
};

start();
