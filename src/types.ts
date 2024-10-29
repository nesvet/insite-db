import type { JSONSchema4 } from "json-schema";
import type {
	Collection,
	CreateIndexesOptions,
	Db,
	Document,
	IndexSpecification,
	MongoClientOptions
} from "mongodb";


export type Options = {
	url: string;
	name: string;
} & MongoClientOptions;

export type InSiteDB = Db;

export type InSiteCollectionSchema = JSONSchema4;

export type InSiteCollectionOptions = {
	fullDocument?: boolean;
	jsonSchema?: InSiteCollectionSchema;
	indexes?: InSiteCollectionIndexes;
	blockCompressor?: "none" | "snappy" | "zlib" | "zstd";
	watch?: boolean;
};

export type InSiteCollectionIndexes = [ IndexSpecification, CreateIndexesOptions? ][];

export type InSiteCollection<Doc extends Document = Document> = Collection<Doc>;

export type InSiteWatchedCollection<Doc extends Document = Document> = Collection<Doc> & Required<Pick<Collection<Doc>, "changeListeners" | "changeStream">>;
