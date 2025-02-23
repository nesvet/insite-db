import type { JSONSchema4 } from "json-schema";
import type {
	ChangeStreamDocument,
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

export type ChangeStreamListener<TSchema extends Document> = (listener: ChangeStreamDocument<TSchema>) => void;

export type WatchedCollection<Doc extends Document = Document> =
	Collection<Doc> &
	Required<Pick<Collection<Doc>, "changeStream" | "onceChange" | "onChange" | "prependChange" | "prependOnceChange" | "removeChangeListener">>;
