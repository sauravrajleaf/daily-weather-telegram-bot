import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

require('dotenv').config();

interface MongooseModuleFactoryOptions {
  uri: string;
}

async function createMongooseConnection(): Promise<MongooseModuleFactoryOptions> {
  const uri = process.env.MONGO_URL;
  return mongoose
    .connect(uri)
    .then((connection) => {
      console.log(`MongoDB connected: ${connection.connection.host}`);
      return { uri };
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
      throw error;
    });
}
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: createMongooseConnection,
    }),
  ],
})
export class DatabaseModule {
  constructor() {}
}
