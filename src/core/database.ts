import MongoStore from "connect-mongo";
import { MongoClient, ObjectId } from "mongodb";
import {
  DocumentInsertion,
  DocumentModification,
  DocumentOrNull,
  Documents,
  PipotDatabase
} from "../types/db.js";

class Database {
  private client: MongoClient;
  private db: PipotDatabase;
  public store: MongoStore;

  public async init(): Promise<void> {
    const url = process.env.MONGODB_URL as string;
    this.client = new MongoClient(url);

    try {
      await this.client.connect();
      console.log(`Connected to MongoDB database.`);
      this.db = this.client.db("pipot");
      this.store = new MongoStore({ client: this.client });
    } catch (error) {
      console.log(`Db connection failed: ${error}`);
    }
  }

  public async findOne(collectionName: string, filter: object): Promise<DocumentOrNull> {
    return await this.db
      .collection(collectionName)
      .findOne(filter);
  }

  public async findAll(collectionName: string, filter = {}): Promise<Documents> {
    return await this.db
      .collection(collectionName)
      .find(filter)
      .toArray();
  }

  public async insert(collectionName: string, value: object): Promise<DocumentInsertion> {
    return await this.db
      .collection(collectionName)
      .insertOne(value);
  }

  async update(collectionName: string, filter: object, update: object): Promise<DocumentModification> {
    return await this.db
      .collection(collectionName)
      .findOneAndUpdate(filter, { $set: update });
  }

  async delete(collectionName: string, _id: ObjectId): Promise<DocumentModification> {
    // returns null if no deletion, else returns document
    return await this.db
      .collection(collectionName)
      .findOneAndDelete({ _id });
  }
}

const database = new Database();
export default database;