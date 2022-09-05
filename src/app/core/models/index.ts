interface ICity{
    id: number,
    name: string,
    iata: string, //todo change this to some of "LRV" etc
    systemName: string,
    countryId: number
    isDeleted: boolean
}
  
interface ICountry{
    id: number,
    name: string,
    systemName: string,
    defaultCurrencyId: number,
    isDeleted: boolean
}

interface IAirport{
    id: number,
    parentId: number,
    name: string,
    iata: string,
    isVirtual: boolean,
    icao: string,
    altitude: number,
    latitude: number,
    longitude: number,
    timezone: number,
    systemName: string,
    cityId: number,
    isDeleted: true
}

interface IAllowedDirection{
    id: number,
    cityFromId: number,
    cityToId: number
}

export {
    ICity,
    IAirport,
    ICountry,
    IAllowedDirection
}