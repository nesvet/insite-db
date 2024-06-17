import { ObjectId } from "mongodb";


export function newObjectIdString() {
	return (new ObjectId()).toString();
}
