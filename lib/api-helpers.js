import { ObjectId } from "mongodb";
export function toClientDoc(doc) {
    const { _id, ...rest } = doc;
    return { id: _id.toString(), ...rest };
}
export function toClientDocs(docs) {
    return docs.map(toClientDoc);
}
export function toObjectId(id) {
    try {
        return new ObjectId(id);
    }
    catch {
        return null;
    }
}
