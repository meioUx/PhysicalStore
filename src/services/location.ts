export async function getDataByCEP(cep: string) {
        const url = `https://viacep.com.br/ws/${cep}/json/`;
        const res = await fetch(url);
        const data = await res.json();
        return data
}

export async function searchCoords(city:string, state:string) {
    try {
        const url = `https://nominatim.openstreetmap.org/search?city=${city}&state=${state}&country=Brazil&format=json`;
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Erro HTTP: ${res.status}`);
        }
        const data = await res.json();
        return {
            lat: data[0].lat as number,
            lng: data[0].lon as number
        };
    } catch (error) {
        return {
            lat: 0,
            lng: 0
        };
    }
    
}