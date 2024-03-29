import mongoose from 'mongoose';

interface LocationAttrs {
  country: string;
  city: string;
  isPhysical: boolean;
  coordinates?: [{
    latitude: number;
    longitude: number;
  }];
}

export interface LocationDoc extends mongoose.Document {
  country: string;
  city: string;
  isPhysical: boolean;
  coordinates?: [{
    latitude: number;
    longitude: number;
  }];
}

interface LocationModel extends mongoose.Model<LocationDoc> {
  build(attrs: LocationAttrs): LocationDoc;
}

const locationSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  isPhysical: {
    type: Boolean,
    required: true,
  },
  coordinates: {
    type: [{
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    }],
    required: false,
  },
});

locationSchema.statics.build = (attrs: LocationAttrs) => {
  return new Location(attrs);
};

const Location = mongoose.model<LocationDoc, LocationModel>(
  'Location',
  locationSchema
);

export { Location };
