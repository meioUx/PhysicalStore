const { MongoClient } = require('mongodb');

async function connectDB() {
    const client = new MongoClient('mongodb://localhost:27017'); // Ajuste o URI se necessário
    await client.connect();
    console.log("Conectado ao MongoDB");
    return client.db('nomeDoSeuBanco').collection('stores');
}

module.exports = connectDB;
