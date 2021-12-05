import MongoStore from "connect-mongo";
import { Db, MongoClient, ObjectId } from "mongodb";

class Database {
  private client: MongoClient;
  private db: Db;
  public store: MongoStore;

  async init() {
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

  async getOne(collectionName: string, filter: object) {
    return await this.db
      .collection(collectionName)
      .findOne(filter);
  }

  async getAll(collectionName: string, filter = {}) {
    return await this.db
      .collection(collectionName)
      .find(filter)
      .toArray();
  }

  async insert(collectionName: string, value: object) {
    return await this.db
      .collection(collectionName)
      .insertOne(value);
  }

  async update(collectionName: string, filter: object, update: object) {
    return await this.db
      .collection(collectionName)
      .findOneAndUpdate(filter, { $set: update });
  }

  async delete(collectionName: string, _id: ObjectId) {
    // returns null if no deletion, else returns document
    return await this.db
      .collection(collectionName)
      .findOneAndDelete({ _id });
  }
}

const database = new Database();
export default database;