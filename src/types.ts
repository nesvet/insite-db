import type { JSONSchema4 } from "json-schema";
import type {
	Collection,
	CreateIndexesOptions,
	Db,
	Document,
	IndexSpecification,
	MongoClientOptions
} from "mongodb";


export type Options = MongoClientOptions & {
	url: string;
	name: string;
};

export type DB = Db;

export type CollectionSchema = JSONSchema4;

export type EnsureOptions = {
	fullDocument?: boolean;
	jsonSchema?: CollectionSchema;
	indexes?: CollectionIndexes;
	blockCompressor?: "none" | "snappy" | "zlib" | "zstd";
	watch?: boolean;
};

export type CollectionIndexes = [ IndexSpecification, CreateIndexesOptions? ][];

export type WatchedCollection<Doc extends Document = Document> = Collection<Doc> & Required<Pick<Collection<Doc>, "changeListeners" | "changeStream">>;
