import { Collection, Db } from "mongodb";
import { IStore } from "../interfaces/store";
import { client } from "./connection";
import { stores } from "../services/stores";

async function checkPopulateDB(collection: Collection<IStore>) {
    const estimate = await collection.estimatedDocumentCount();
    if (estimate > 0) {
        return true
    }
    return false
}

export async function populateDB() {
    const database = client.db("company");
    const storesCollection = database.collection<IStore>("stores");
    const populate = await checkPopulateDB(storesCollection)
    if (populate) {
        return
    }

    const result = await storesCollection.insertMany(stores,
        { ordered: true }
    );
    console.log(`${result.insertedCount} documents were inserted`);
}
