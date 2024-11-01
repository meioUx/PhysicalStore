import { MongoClient, ServerApiVersion } from "mongodb";

const uri = "mongodb+srv://paular:Senha123$@cluster0.f5udx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

export const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
}
);

export async function connectionDB() {
    await client.connect();
    await client.db("company").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");
}

