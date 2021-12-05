import { Db, WithId, Document, InsertOneResult, ModifyResult } from "mongodb";

export type PipotDatabase = Db;

export type DocumentOrNull = WithId<Document> | null;

export type Documents = WithId<Document>[];

export type DocumentInsertion = InsertOneResult<Document>;

export type DocumentModification = ModifyResult<Document>;