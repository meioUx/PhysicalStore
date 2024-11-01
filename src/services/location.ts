import { logger } from "../lib/winston";

export async function getDataByCEP(cep: string) {
    console.log(cep)
    try {
        const url = `https://viacep.com.br/ws/${cep}/json/`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Erro HTTP: ${res.status}`);
        }
        const data = await res.json();
        logger.info(`CEP data obtained: ${cep}`, data);
        return data
    } catch (error) {
        logger.error(`Error getting CEP data:\n ${JSON.stringify(error)}`);
    }

}

export async function searchCoords(city: string, state: string) {
    try {
        const url = `https://nominatim.openstreetmap.org/search?city=${city}&state=${state}&country=Brazil&format=json`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Erro HTTP: ${res.status}`);
        }
        const data = await res.json();
        logger.info(`Coords data obtained: ${city}, ${state}`, data);
        return {
            lat: data[0].lat as number,
            lng: data[0].lon as number
        };
    } catch (error) {
        logger.error(`Error getting coordinate data:\n ${JSON.stringify(error)}`);
        return {
            lat: 0,
            lng: 0
        };
    }

}