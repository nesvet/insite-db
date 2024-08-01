import { MongoClient } from "mongodb";
import { InSiteCollections } from "./Collections";
import type { InSiteDB, Options } from "./types";


export async function connect({ url, name, ...mongoClientOptions }: Options) {
	
	if (/localhost/.test(url))
		url = url.replace(/localhost/, "127.0.0.1");
	
	const client = new MongoClient(url, {
		maxPoolSize: 100,
		...mongoClientOptions
	});
	
	try {
		await client.connect();
		console.info("🌿 Mongo Client connected to", url.replace(/(?<=\/\/)[^:]+?:[^@]+@/, "").replace(/[/?][^/]*$/, ""));
	} catch (error) {
		console.error("🌿❗️ Mongo Client connection: ", error);
	}
	
	client
		.on("close", () => console.error("🌿❗️ Mongo DB socket closed"))
		.on("error", error => console.error("🌿❗️ Mongo DB:", error))
		.on("parseError", error => console.error("🌿❗️ Mongo DB parse:", error))
		.on("reconnect", () => console.info("🌿 Mongo DB reconnected"))
		.on("timeout", () => console.error("🌿❗️ Mongo DB timeout"));
	
	const db = client.db(name) as InSiteDB;
	
	const collections = new InSiteCollections(db);
	
	return {
		client,
		db,
		collections
	};
}
