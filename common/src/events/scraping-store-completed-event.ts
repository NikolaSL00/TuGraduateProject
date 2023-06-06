import { Subjects } from './subjects';

export interface ScrapingStoreCompletedEvent {
  subject: Subjects.ScrapingStoreCompleted;

  data: {
    name: string;
    locations: [
      {
        country: string;
        city: string;
        isPhysical: boolean;
        coordinates?: [{
          latitude: number;
          longitude: number;
        }];
      }
    ];
    products: [
      {
        title: string;
        description: string;
        imageUrl: string;
        price: string;
        unit: string;
        productUrl: string;
      }
    ];
  };
}
