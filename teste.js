
async function getDataByCEP(cep) {
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    const res = await fetch(url)
    const data = await res.json()
    console.log(data)
    return data

}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

const stores = [
    { name: "Loja A", lat: -23.550520, lng: -46.633308 },
    { name: "Loja B", lat: -22.908333, lng: -43.196388 },
    { name: "Loja C", lat: -25.4297, lng: -49.2719 },
];

async function nearbyStores(cep) {
    try {
        const dataCEP = await getDataByCEP(cep);
        const { logradouro, localidade, uf, cep: findedCEP } = dataCEP;
        const { lat, lng } = await searchCoords(localidade, uf);

        console.log(`CEP: ${findedCEP} | Local: ${logradouro}, ${localidade} - ${uf}`);
        console.log(`Coordenadas do CEP: Latitude ${lat}, Longitude ${lng}`);

        console.log('\nLojas em um raio de 100 km:');
        stores.forEach(store => {
            const distance = calculateDistance(lat, lng, store.lat, store.lng);
            if (distance <= 100) {
                console.log(`${store.name} está a ${distance.toFixed(2)} km de distância.`);
            }
        });

    } catch (error) {
        console.log("Erro:", error);
    }
}

async function searchCoords(city, state) {
    const url = `https://nominatim.openstreetmap.org/search?city=${city}&state=${state}&country=Brazil&format=json`;

    const res = await fetch(url)
    const data = await res.json()
    console.log(data[0])
    return {
        lat: data[0].lat,
        lng: data[0].lon
    }
}

const cep = '01001000';
nearbyStores(cep);
