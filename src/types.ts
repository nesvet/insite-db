import type { Db } from "mongodb";
import type { Collections } from "./Collections";


export type InSiteDB = {
	insiteCollections: Collections;
} & Db;

export type InSiteCollectionOptions = {
	fullDocument?: boolean;
	jsonSchema?: Record<string, unknown>;
	blockCompressor?: "none" | "snappy" | "zlib" | "zstd";
	watch?: boolean;
};
