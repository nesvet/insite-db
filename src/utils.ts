import { ObjectId } from "mongodb";


export function StringId() {
	return (new ObjectId()).toString();
}
