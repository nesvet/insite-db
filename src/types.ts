import type { CreateIndexesOptions, Db, IndexSpecification } from "mongodb";
import type { Collections } from "./Collections";


export type InSiteDB = {
	insiteCollections: Collections;
} & Db;

export type InSiteCollectionSchema = Record<string, unknown>;

export type InSiteCollectionOptions = {
	fullDocument?: boolean;
	jsonSchema?: InSiteCollectionSchema;
	blockCompressor?: "none" | "snappy" | "zlib" | "zstd";
	watch?: boolean;
};

export type InSiteCollectionIndexes = [ IndexSpecification, CreateIndexesOptions? ][];
