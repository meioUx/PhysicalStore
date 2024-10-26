const connectDB = require('./database');

async function seedStores() {
    const stores = [
        { name: "Loja AC1", location: { type: "Point", coordinates: [-67.8243, -9.97499] }, rua: "Rua da Capital", numero: 100, estado: "Acre", cidade: "Rio Branco" },
        { name: "Loja AC2", location: { type: "Point", coordinates: [-68.4303, -10.9391] }, rua: "Rua Secundária", numero: 101, estado: "Acre", cidade: "Sena Madureira" },
        // Continue com todas as suas lojas...
    ];

    const storesCollection = await connectDB();
    
    await storesCollection.insertMany(stores);
    console.log("Lojas inseridas com sucesso!");
}

seedStores();
