import type { Collection, Document } from "mongodb";
import { captureStackTrace } from "@nesvet/n";
import { printChangeStreamChangeDetails, printChangeStreamError } from "./utils";
import type { CollectionOptions, DB, WatchedCollection } from "./types";


export class Collections extends Map<string, Collection> {
	constructor(db: DB) {
		super();
		
		this.db = db;
		
	}
	
	db: DB;
	
	[key: string]: Collection | unknown;
	
	async ensure<Doc extends Document>(name: string, options: CollectionOptions & { watch: false }): Promise<Collection<Doc>>;
	async ensure<Doc extends Document>(name: string, options?: CollectionOptions): Promise<WatchedCollection<Doc>>;
	async ensure(name: string, options: CollectionOptions = {}) {
		
		const { db } = this;
		
		let collection = this.get(name);
		
		if (!collection) {
			if ((await db.listCollections({ name }, { nameOnly: true }).toArray()).length)
				collection = db.collection(name);
			else {
				collection = await db.createCollection(name, {
					...options.jsonSchema && { validator: { $jsonSchema: options.jsonSchema } },
					...options.blockCompressor && { storageEngine: { wiredTiger: { configString: `block_compressor=${options.blockCompressor}` } } }
				});
				delete options.jsonSchema;
				delete options.blockCompressor;
			}
			
			if (options.watch !== false) {
				const changeStream = collection.watch(undefined, { fullDocument: options.fullDocument === false ? undefined : "updateLookup" });
				
				if (process.env.NODE_ENV === "development" ? options.quiet !== true : !options.quiet)
					changeStream.on("change", printChangeStreamChangeDetails);
				
				changeStream.on("error", printChangeStreamError);
				
				collection.changeStream = changeStream;
			}
			
			this.set(name, collection);
			this[name] = collection;
			
			if (options.watch !== false) {
				collection.changeListeners = new Set();
				
				collection.changeStream =
					collection.watch(undefined, { fullDocument: options.fullDocument === false ? undefined : "updateLookup" })
						.on("change", handleChangeStreamChange)
						.on("error", handleChangeStreamError);
			}
		}
		
		if (options.jsonSchema)
			await db.command({
				collMod: name,
				...options.jsonSchema && { validator: { $jsonSchema: options.jsonSchema } }
			});
		
		if (options.indexes)
			await collection.ensureIndexes(options.indexes);
		
		return collection;
	}
	
}
