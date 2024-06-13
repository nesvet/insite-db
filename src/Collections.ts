import type { ChangeStream, ChangeStreamDocument, Collection } from "mongodb";
import type { CollectionOptions, InSiteDB } from "./types";


/* @this ChangeStream */
function handleChangeStreamChange(this: ChangeStream, next: ChangeStreamDocument) {
	
	if (process.env.NODE_ENV === "development")
		console.log("Change stream change", (this.parent as Collection).collectionName, next);
	
	for (const listener of (this.parent as Collection).changeListeners!)
		listener(next);
	
}

/* @this ChangeStream */
function handleChangeStreamError(this: ChangeStream, error: Error) {
	console.error(`🌿❗️ Mongo ${(this.parent as Collection).collectionName} Change Stream:\n`, error.stack);
	
}


export class Collections extends Map<string, Collection> {
	constructor(db: InSiteDB) {
		super();
		
		this.db = db;
		
	}
	
	db: InSiteDB;
	
	[key: string]: Collection | unknown;
	
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
		
		return collection;
	}
	
}
