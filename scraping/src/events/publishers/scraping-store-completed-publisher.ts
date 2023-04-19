import {
  Publisher,
  ScrapingStoreCompletedEvent,
  Subjects,
} from '@shopsmart/common';

export class ScrapingStoreCompletedPublisher extends Publisher<ScrapingStoreCompletedEvent> {
  readonly subject = Subjects.ScrapingStoreCompleted;
}
