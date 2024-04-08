export class Collections extends Map {
	constructor(db) {
		super();
		
		this.db = db;
		
	}
	
	async ensure(name, options = {}) {
		
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
					collection.watch({ fullDocument: options.fullDocument === false ? undefined : "updateLookup" })
						.on("change", collection.handleChangeStreamChange)
						.on("error", Collections.handleChangeStreamError);
			}
		}
		
		if (options.jsonSchema)
			await db.command({
				collMod: name,
				...options.jsonSchema && { validator: { $jsonSchema: options.jsonSchema } }
			});
		
		return collection;
	}
	
	
	static handleChangeStreamError(error) {
		console.error(`🌿❗️ Mongo ${this.parent.collectionName} Change Stream:`, error);
		
	}
	
}
