import { Collection } from "mongodb";


Collection.prototype.ensureIndexes = async function (indexesToEnsure) {
	
	// const existingIndexes = await this.indexes();
	
	// TODO:
	
	try {
		for (const indexToEnsure of indexesToEnsure)
			await this.createIndex(...indexToEnsure);
	} catch {}
	
};

Collection.prototype.handleChangeStreamChange = function (next) {
	
	if (process.env.NODE_ENV === "development")
		console.log("Change stream change", this.parent.collectionName, next);
	
	for (const listener of this.parent.changeListeners)
		listener(next);
	
};
