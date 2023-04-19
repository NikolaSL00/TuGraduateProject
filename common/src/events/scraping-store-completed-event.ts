import { Subjects } from './subjects';

export interface ScrapingStoreCompletedEvent {
  subject: Subjects.ScrapingStoreCompleted;

  data: [
    {
      title: string;
      description: string;
      imageUrl: string;
      price: string;
      unit: string;
      productUrl: string;
    }
  ];
}