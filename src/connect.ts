import { MongoClient } from "mongodb";
import { Collections } from "./Collections";
import type { DB, Options } from "./types";


export async function connect({ url, name, ...mongoClientOptions }: Options) {
	
	if (/localhost/.test(url))
		url = url.replace(/localhost/, "127.0.0.1");
	
	const client = new MongoClient(url, {
		maxPoolSize: 100,
		...mongoClientOptions
	});
	
	try {
		await client.connect();
		console.info("🌿 MongoDB Client connected to", url.replace(/(?<=\/\/)[^:]+?:[^@]+@/, "").replace(/[/?][^/]*$/, ""));
	} catch (error) {
		console.error("🌿❗️ MongoDB Client connection: ", error);
	}
	
	client
		.on("close", () => console.error("🌿❗️ MongoDB socket closed"))
		.on("error", error => console.error("🌿❗️ MongoDB:", error))
		.on("parseError", error => console.error("🌿❗️ MongoDB parse:", error))
		.on("reconnect", () => console.info("🌿 MongoDB reconnected"))
		.on("timeout", () => console.error("🌿❗️ MongoDB timeout"));
	
	const db = client.db(name) as DB;
	
	const collections = new Collections(db);
	
	return {
		client,
		db,
		collections
	};
}
