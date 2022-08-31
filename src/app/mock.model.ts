export interface Airport {
  id: number;
  name: string;
  cityId: number;
  iata: string;
  parentId?: number;
  isVirtual: boolean;
  icao: string;
  altitude?: number;
  latitude?: number;
  longitude?: number;
  timezone?: number;
  systemName: string;
  isDeleted: boolean;
}

export interface Country {
  id: number;
  name: string;
  systemName: string;
  defaultCurrencyId: number;
  isDeleted: boolean;
}

export interface City {
  id: number;
  name: string;
  countryId: number;
  countryName?: string;
  iata?: string;
  systemName: string;
  isDeleted: boolean;
}

export interface AllowedDirection {
  id: number;
  cityFromId: number;
  cityToId: number;
  countryFromId?: number;
  countryToId?: number;
}

export interface Order {
  passengers: Passenger[];
  airportFrom: Airport;
  departureDate: Date;
  airportTo: Airport;
  arrivalDate: Date;
}

export interface Passenger {
  documentType: PassengerDocumentType;
  nationalityId: number;
  passportDateOfExpire: Date;
  passportNo: string;
  birthdate: Date;
  lName: string;
  fName: string;
  sex: string;
}

export interface Nationality {
  id: number;
  name: string;
  code: string;
}

export enum PassengerDocumentType {
  /** Загранпаспорт */
  InternationalPassport = 1,

  /** Внутренний паспорт */
  InternalPassport = 2,

  /** Св-во о рождении */
  BirthCertificate = 3,
}
