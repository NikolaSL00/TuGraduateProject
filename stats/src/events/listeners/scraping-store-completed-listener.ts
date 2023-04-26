import { Message } from 'node-nats-streaming';
import {
  Subjects,
  Listener,
  ScrapingStoreCompletedEvent,
} from '@shopsmart/common';
import { queueGroupName } from './queue-group-name';
import { processData } from '../../services/scrape-store-service';

export class ScrapingStoreCompletedListener extends Listener<ScrapingStoreCompletedEvent> {
  readonly subject = Subjects.ScrapingStoreCompleted;
  queueGroupName = queueGroupName;

  async onMessage(data: ScrapingStoreCompletedEvent['data'], msg: Message) {
    console.log('Data received: ', data.name);

    const store = await processData(data);
    console.log(store);

    msg.ack();
  }
}
