import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, filter, forkJoin } from 'rxjs';
import { ICountry, ICity, IAirport, IAllowedDirection } from '../core/models';
import { DataService } from '../core/services/data.service';

@Component({
  selector: 'order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private dataService: DataService) { 
  }

  countries: ICountry[] = [];
  cities: ICity[] = [];
  allowedDirections: IAllowedDirection[] = [];
  airports: IAirport[] = [];


  filteredDepartureCities$: BehaviorSubject<ICity[]> = new BehaviorSubject(this.cities);
  filteredDepartureCountries$: BehaviorSubject<ICountry[]> = new BehaviorSubject(this.countries);
  filteredDepartureAirports$: BehaviorSubject<IAirport[]> = new BehaviorSubject(this.airports);


  filteredArrivalCities$: BehaviorSubject<ICity[]> = new BehaviorSubject(this.cities);
  filteredArrivalCountries$: BehaviorSubject<ICountry[]> = new BehaviorSubject(this.countries);
  filteredArrivalAirports$: BehaviorSubject<IAirport[]> = new BehaviorSubject(this.airports);


  orderForm = this.fb.group({
    departureCountry: ['', Validators.required],
    departureCity: ['', Validators.required],
    departureAirport: ['', Validators.required],
    arrivalCountry: ['', Validators.required],
    arrivalCity: ['', Validators.required],
    arrivalAirport: ['', Validators.required],
    passengers: this.fb.array([this.createPassenger()])
  });

  get passengers(): FormArray {
    return this.orderForm.get('passengers') as FormArray;
  }

  createPassenger(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      age: ['', Validators.required],
      passportValidEnd: [Date.now, Validators.required]
    })
  }

  displayCountryName(country: ICountry): string {
    return country?.name;
  }

  displayCityName(city: ICity): string {
    return city?.name;
  }

  displayAirportName(airport: ICity): string {
    return airport?.name;
  }

  addPassenger() {
    this.passengers.push(this.createPassenger());
  }



  ngOnInit(): void {
    forkJoin([
      this.dataService.getCountries(),
      this.dataService.getCities(),
      this.dataService.getAirports(),
      this.dataService.getAllowedDirections()
    ]).subscribe(([countriesData, citiesData, airportsData, allowedDirectionsData]) => {

      //todo refactor this

      this.airports = airportsData;
      this.allowedDirections = allowedDirectionsData;

      //todo maybe should use Set on this to get only uniq in both collections
      const [citiesFromIds, citiesToIds] = [allowedDirectionsData.map(direction => direction.cityFromId), allowedDirectionsData.map(direction => direction.cityToId)];


      const availableCityIds = new Set([...citiesFromIds, ...citiesToIds]); //all uniq values from allowed directions

     

      const airportCityIds = airportsData.map(airport => airport.cityId);

      this.airports = airportsData;

      //realy available cities to select, based on available to select cities getted from allowed directions 
      //- check that city exists in allowed directions and it has airports 
      this.cities = citiesData.filter(city => (availableCityIds.has(city.id)) && (airportCityIds.includes(city.id)));

      const availableCountryIds = this.cities.map(city => city.countryId);

      this.countries = countriesData.filter(country => availableCountryIds.includes(country.id)); //realy available to select countries based on available cities



      const citiesFrom = this.cities.filter(city => citiesFromIds.includes(city.id));
      const citiesTo = this.cities.filter(city => citiesToIds.includes(city.id));

      const countryIdsFromCities = new Set(citiesFrom.map(city => city.countryId));
      const countryIdsToCities = new Set(citiesTo.map(city => city.countryId));

  

      this.filteredDepartureCountries$.next(this.countries.filter(country => countryIdsFromCities.has(country.id)));
      this.filteredArrivalCountries$.next(this.countries.filter(country => countryIdsToCities.has(country.id)));
    });

    this.orderForm.get('departureCountry')?.valueChanges
      .pipe(filter(value => typeof value !== 'string'))
      .subscribe((data: ICountry) => {
        // todo need to change something to do it more simple, need to modificate source collections(use midificated copies of source arrays)
        const newCities = this.cities.filter(city => city.countryId === data.id);
        const newArrivalCitiesIds = newCities.map(city => city.id);

        this.filteredDepartureCities$.next(newCities);
        const directions = this.allowedDirections.filter(direction => newArrivalCitiesIds.includes(direction.cityFromId)).map(direction => direction.cityToId);

        const arrivalCities = this.cities.filter(city => directions.includes(city.id));
        const arrivalCountryIds = arrivalCities.map(city => city.countryId);

        const newArrivalCountries = this.countries.filter(country => arrivalCountryIds.includes(country.id));

        this.filteredArrivalCountries$.next(newArrivalCountries);
      });

    this.orderForm.get('departureCity')?.valueChanges
      .pipe(filter(value => typeof value !== 'string'))
      .subscribe((data: ICity) => {
        this.filteredDepartureAirports$.next(this.airports.filter(airport => airport.cityId === data.id));
      });

    this.orderForm.get('arrivalCountry')?.valueChanges
      .pipe(filter(value => typeof value !== 'string'))
      .subscribe((data: ICountry) => {
        this.filteredArrivalCities$.next(this.cities.filter(city => city.countryId === data.id));
      });

    this.orderForm.get('arrivalCity')?.valueChanges
      .pipe(filter(value => typeof value !== 'string'))
      .subscribe((data: ICity) => {
        this.filteredArrivalAirports$.next(this.airports.filter(airport => airport.cityId === data.id));
      })

    
  }

};
