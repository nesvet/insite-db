import { type ChangeStreamDocument, Collection } from "mongodb";


declare module "mongodb" {
	export interface Collection<TSchema> { // eslint-disable-line no-shadow
		changeListeners?: Set<(listener: ChangeStreamDocument<TSchema>) => void>;
		changeStream?: ChangeStream<TSchema>;
		ensureIndexes(indexesToEnsure: [ IndexSpecification, CreateIndexesOptions? ][]): Promise<void>;
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


export { type ChangeStreamDocument, Collection as InSiteCollection } from "mongodb";
