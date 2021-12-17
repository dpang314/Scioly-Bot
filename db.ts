import * as mongoose from 'mongoose';
import { MONGO_URI } from './configLoader';

interface Test {
  _id?: string,
  user_id: string,
  partner1_id?: string,
  partner2_id?: string,
  time_started: Date,
  test_name: string,
  finished: boolean,
  [x: string]: any,
}

const testSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  partner1_id: String,
  partner2_id: String,
  test_name: {
    type: String,
    required: true,
  },
  time_started: {
    type: Date,
    required: true,
  },
  finished: {
    type: Boolean,
    required: true,
    default: false
  }
});

const TestModel = mongoose.model('Test', testSchema);

mongoose.connect(MONGO_URI);

export { TestModel, Test };