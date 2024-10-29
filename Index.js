
const winston = require('winston');
const stores = require('./stores');


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

// requisições
async function fetchWithErrorHandling(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Erro HTTP: ${res.status}`);
        }
        return await res.json();
    } catch (error) {
        logger.error(`Erro ao buscar dados da API: ${error.message}`);
        throw error;
    }
}

// CEP com ViaCEP
async function getDataByCEP(cep) {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    const data = await fetchWithErrorHandling(url);
    logger.info(`Dados obtidos do CEP: ${cep}`, data);
    return data;
}

// Calculo de distância
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// coordenadas 
async function searchCoords(city, state) {
    const url = `https://nominatim.openstreetmap.org/search?city=${city}&state=${state}&country=Brazil&format=json`;
    const data = await fetchWithErrorHandling(url);
    logger.info(`Coordenadas encontradas para ${city}, ${state}: ${data[0].lat}, ${data[0].lon}`);
    return {
        lat: data[0].lat,
        lng: data[0].lon
    };
}

// Localizar as lojas perto
export async function nearbyStores(cep) {
    try {
        const dataCEP = await getDataByCEP(cep);
        const { logradouro, localidade, uf, cep: findedCEP } = dataCEP;
        const { lat, lng } = await searchCoords(localidade, uf);

        return dataCEP

        logger.info(`CEP: ${findedCEP} | Local: ${logradouro}, ${localidade} - ${uf}`);
        logger.info(`Coordenadas do CEP: Latitude ${lat}, Longitude ${lng}`);

        const nearby = stores
            .map(store => ({
                ...store,
                distance: calculateDistance(lat, lng, store.lat, store.lng)
            }))
            .filter(store => store.distance <= 100)
            .sort((a, b) => a.distance - b.distance);

        if (nearby.length === 0) {
            logger.info("Nenhuma loja encontrada no raio de 100km.");
        } else {
            logger.info('Lojas em um raio de 100 km:');
            nearby.forEach(store => {
                logger.info(`${store.name} está a ${store.distance.toFixed(2)} km de distância.`);
                logger.info(`Endereço: ${store.rua}, ${store.numero}, ${store.cidade} - ${store.estado}`);
            });
        }
    } catch (error) {
        logger.error("Erro:", error);
    }
}

//consulta
const cep = '01001000';
nearbyStores(cep);
