import { Message } from "node-nats-streaming";
import { processData } from "../../services/scrape-store-service";
import {
  Subjects,
  Listener,
  ScrapingStoreCompletedEvent,
} from "@shopsmart/common";
import { queueGroupName } from "./queue-group-name";

export class ScrapingStoreCompletedListener extends Listener<ScrapingStoreCompletedEvent> {
  readonly subject = Subjects.ScrapingStoreCompleted;
  queueGroupName = queueGroupName;

  async onMessage(data: ScrapingStoreCompletedEvent["data"], msg: Message) {
    console.log("Data received: ", data.name);

    const store = await processData(data);
    console.log(store);
    // console.log('products-length: ', store.products.length);

    msg.ack();
  }
}
