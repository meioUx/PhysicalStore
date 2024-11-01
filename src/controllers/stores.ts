
import { getStoresFromDB } from "../db/helpers";
import { IStore } from "../interfaces/store";
import { getDataByCEP, searchCoords } from "../services/location";
import { calculateDistance } from "../utils";

export async function nearbyStores(cep: string) {
    try {
        const stores = await getStoresFromDB()
        const dataCEP = await getDataByCEP(cep);
        const { logradouro, localidade, uf, cep: findedCEP } = dataCEP;
        const { lat, lng } = await searchCoords(localidade, uf);


        console.log(`CEP: ${findedCEP} | Local: ${logradouro}, ${localidade} - ${uf}`);
        console.log(`Coordenadas do CEP: Latitude ${lat}, Longitude ${lng}`);

        const nearby: any[] = stores?.map((store) => ({
            ...store,
            distance: calculateDistance(lat, lng, store.lat, store.lng)
        })).filter(store => store.distance <= 100).sort((a, b) => a.distance - b.distance) || []

        if (nearby.length === 0) {
            return ({list: [], error: "Ops! Nenhuma loja encontrada no raio de 100km." });
        } else {
            console.log('Lojas em um raio de 100 km:');
            const listStores: IStore[] = []
            nearby.forEach(store => {
                console.log(`${store.name} está a ${store.distance.toFixed(2)} km de distância.`);
                console.log(`Endereço: ${store.rua}, ${store.numero}, ${store.cidade} - ${store.estado}`);
                listStores.push(store)
            });
            return { location: dataCEP, list: listStores }
        }
    } catch (error) {
        console.warn("Erro:", error);
    }
}