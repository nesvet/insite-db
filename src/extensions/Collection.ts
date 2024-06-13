import {
	type ChangeStreamDocument,
	Collection,
	type CreateIndexesOptions,
	type IndexSpecification
} from "mongodb";


type IndexTuple = [ IndexSpecification, CreateIndexesOptions ];

declare module "mongodb" {
	interface Collection { // eslint-disable-line no-shadow
		changeListeners?: Set<(listener: ChangeStreamDocument) => void>;
		changeStream?: ChangeStream;
		ensureIndexes(indexesToEnsure: IndexTuple[]): Promise<void>;
	}
}


Collection.prototype.ensureIndexes = async function (indexesToEnsure) {
	
	// const existingIndexes = await this.indexes();
	
	// TODO:
	
	try {
		for (const indexToEnsure of indexesToEnsure)
			await this.createIndex(...indexToEnsure);
	} catch {}
	
};
