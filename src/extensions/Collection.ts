

const ACTUAL_INDEX_VERSION = 2;


declare module "mongodb" {
	export interface Collection<TSchema> { // eslint-disable-line no-shadow
		
		/** Ensures the presence of `indexes`. */
		ensureIndexes(indexes: CollectionIndexes): Promise<void>;
		
		changeStream?: ChangeStream<TSchema>;
		ensureIndexes(indexesToEnsure: CollectionIndexes): Promise<void>;
	}
}


Collection.prototype.ensureIndexes = async function (indexes) {
	
	const existingIndexes = await this.indexes();
	
	for (let i = 0; i < indexes.length; i++) {
		const [ specification, options = {} ] = indexes[i];
		
		for (let j = 0; j < existingIndexes.length; j++) {
			const existingIndex = existingIndexes[j];
			
			if (
				isDeepStrictEqual(specification, existingIndex.key) &&
				isDeepStrictEqual(options, omit(existingIndex, [ "v", "key", "name" ]))
			) {
				indexes.splice(i--, 1);
				existingIndexes.splice(j, 1);
				break;
			}
		}
	}
	
	await Promise.all([
		...indexes.map(index => this.createIndex(...index)),
		...existingIndexes.filter(({ name, v }) => name && name !== "_id_" && (!v || v <= ACTUAL_INDEX_VERSION)).map(({ name }) => this.dropIndex(name!))
	]);
	
};

};
