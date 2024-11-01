import { IStore } from "../interfaces/store";
import { client } from "./connection";

export async function getStoresFromDB() {
    const database = client.db("company");
    const storesCollection = database.collection<IStore>("stores");
    const stores = await storesCollection.find().toArray();
    return stores;

}