import type { JSONSchema4 } from "json-schema";
import type {
	Collection,
	CreateIndexesOptions,
	Db,
	Document,
	IndexSpecification
} from "mongodb";
import type { InSiteCollections } from "./Collections";


export type InSiteDB = Db;

export type InSiteCollectionSchema = JSONSchema4;

export type InSiteCollectionOptions = {
	fullDocument?: boolean;
	jsonSchema?: InSiteCollectionSchema;
	blockCompressor?: "none" | "snappy" | "zlib" | "zstd";
	watch?: boolean;
};

export type InSiteCollectionIndexes = [ IndexSpecification, CreateIndexesOptions? ][];

export type InSiteCollection<Doc extends Document = Document> = Collection<Doc>;

export type InSiteWatchedCollection<Doc extends Document = Document> = Collection<Doc> & Required<Pick<Collection<Doc>, "changeListeners" | "changeStream">>;
