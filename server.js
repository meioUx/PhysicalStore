const express = require('express');
const { nearbyStores } = require('./Index');
const app = express();

app.use(express.json());
const port = 3000;

app.get('/:name', (req, res) => {
    const { name } = req.params
    res.send('Hello, ' + name);
});

app.get('/cep/:cep', (req, res) => {
    const { cep } = req.params

    const data = nearbyStores(cep).then(data => res.send(data))

});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

