import { ObjectId } from "mongodb";

export type WithId<T> = T & { _id: ObjectId };

export function toClientDoc<T extends Record<string, unknown>>(doc: WithId<T>) {
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

export function toClientDocs<T extends Record<string, unknown>>(docs: Array<WithId<T>>) {
  return docs.map(toClientDoc);
}

export function toObjectId(id: string) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}
