import { app } from './app';
import { scheduler } from './scheduler/scheduler';

const start = async () => {
  app.listen(3000, () => {
    console.log('Scraping server listening on port 3000...');
  });
  scheduler();
};

start();
