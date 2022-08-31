import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, Observable } from 'rxjs';
import {
  Airport,
  AllowedDirection,
  City,
  Country,
  Nationality,
} from './mock.model';

@Injectable({
  providedIn: 'root',
})
export class MockService {
  private airportsUrl: string = '../assets/airports.json';
  private countriesUrl: string = '../assets/countries.json';
  private citiesUrl: string = '../assets/cities.json';
  private nationalitiesUrl: string = '../assets/nationalities.json';
  private allowedDirectionsUrl: string = '../assets/allowedDirections.json';

  constructor(private readonly httpClient: HttpClient) {}

  public getAirports(): Observable<Airport[]> {
    return this.httpClient.get<Airport[]>(this.airportsUrl).pipe(delay(1000));
  }
  public getCountries(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(this.countriesUrl).pipe(delay(500));
  }
  public getCities(): Observable<City[]> {
    return this.httpClient.get<City[]>(this.citiesUrl).pipe(delay(1500));
  }
  public getNationalities(): Observable<Nationality[]> {
    return this.httpClient
      .get<Nationality[]>(this.nationalitiesUrl)
      .pipe(delay(1900));
  }
  public getAllowedDirections(): Observable<AllowedDirection[]> {
    return this.httpClient
      .get<AllowedDirection[]>(this.allowedDirectionsUrl)
      .pipe(delay(300));
  }
}
