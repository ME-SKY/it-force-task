import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { ICountry, ICity, IAirport, IAllowedDirection } from '../core/models';
import { DataService } from '../core/services/data.service';

// {
//   "id": 161,
//   "name": "Австралия",
//   "systemName": "Австралия",
//   "defaultCurrencyId": 3,
//   "isDeleted": true
// },

// {
//   "id": 1899,
//   "name": "Лос-Рокес",
//   "iata": "LRV",
//   "systemName": "LOS ROQUES",
//   "countryId": 190,
//   "isDeleted": false
// },

// interface ICity{
//   id: number,
//   name: string,
//   iata: string, //todo change this to some of "LRV" etc
//   systemName: string,
//   countryId: number
//   isDeleted: boolean
// }

// interface ICountry{
//   id: number,
//   name: string,
//   systemName: string,
//   defaultCurrencyId: number,
//   isDeleted: boolean
// }

// {
//   "id": 313,
//   "parentId": 0,
//   "name": "Гуарульос",
//   "iata": "GRU",
//   "isVirtual": false,
//   "icao": "SBGR",
//   "altitude": 2459,
//   "latitude": -23.425669,
//   "longitude": -46.481926,
//   "timezone": -3,
//   "systemName": "Aeroporto Internacional Guarulhos",
//   "cityId": 899,
//   "isDeleted": true
// }

// interface IAirport{
//   id: number,
//   parentId: number,
//   name: string,
//   iata: string,
//   isVirtual: boolean,
//   icao: string,
//   altitude: number,
//   latitude: number,
//   longitude: number,
//   timezone: number,
//   systemName: string,
//   cityId: number,
//   isDeleted: true
// }

@Component({
  selector: 'order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {

  constructor(private fb: FormBuilder, 
    private http: HttpClient,
    private dataService: DataService) {  //where it should be in contructor or in inOnInit
    // this.orderForm.get('departureCountry').valueChanges.subscribe((v) => {
    //   console.log(v)
    // })
  }

  countries: ICountry [] = [];
  cities: ICity [] = [];
  citiesWithAirports: ICity [] = [];
  airports: IAirport [] = [];
  // testData: Number [] = [1,2,3];
  
  filteredCities$: BehaviorSubject<ICity[]> = new BehaviorSubject(this.cities);
  filteredAirports$: BehaviorSubject<IAirport[]> = new BehaviorSubject(this.airports);
  
  orderForm = this.fb.group({
    departureCountry: [''],
    departureCity: [''],
    departureAirport: [''],
    // arrivalCountry: [''],
    // arrivalCity: [''],
    // arrivalAirport: [''],
    // passangers: this.fb.array([this.createPassenger()])
    
    // userName: ['', [Validators.required, Validators.minLength(2)]],
    // password: ['', [Validators.required, Validators.minLength(2)]]
  });

  get passangers() {
    return this.orderForm.get('passangers') as FormArray;
  }

  createPassenger(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      completed: [false]
    })
  }

  displayCountryName(country: ICountry): string{
    return country?.name;
  }

  displayCityName(city: ICity): string{
    return city?.name;
  }

  displayAirportName(airport: ICity): string{
    return airport?.name;
  }

  addPassenger() {
    this.passangers.push(this.createPassenger());
  }

  // countries
  

  ngOnInit(): void {
    forkJoin([
      this.dataService.getCountries(),
      this.dataService.getCities(),
      this.dataService.getAirports(),
      this.dataService.getAllowedDirections()
    ]).subscribe(([countriesData, citiesData, airportsData, allowedDirectionsData]) => {
      
      this.airports = airportsData;

      // const allowedCityIds = new Set([
      //   ...allowedDirectionsData.map(direction => direction.cityFromId),
      //   ...allowedDirectionsData.map(direction => direction.cityToId)
      // ]);
      const allowedCityIds = allowedDirectionsData.reduce((prev: number [], next: IAllowedDirection) => {return [...prev, next.cityFromId, next.cityToId]}, []);

      const availableCityIds = new Set(allowedCityIds);
      
      const airportCityIds = airportsData.map(airport => airport.cityId);

      this.cities = citiesData.filter(city => airportCityIds.includes(city.id) && availableCityIds.has(city.id));

      const availableCountries = this.cities.map(city => city.countryId);

      this.countries = countriesData.filter(country => availableCountries.includes(country.id));

      
      // allowedIds.push(...allowedDirectionsData.map(dir => dir.cityToId));
      // this.cities.filter(city => allowedDirectionsData.

      // console.log('allowedIds');
      
      // console.log(allowedCityIds);

      // console.log('cities ids', this.cities.map(city => city.id));
      
      
      // this.airports =        
    });

    // this.http.get('./assets/countries.json').subscribe((data) => {
    //   // console.log('cities');
    //   // console.log(data);
    //   this.countries = data as Array<ICountry>;
    // });

    // this.http.get('./assets/cities.json').subscribe(data => {
    //   // console.log('cities');
    //   // console.log(data);
    //   this.cities = data as Array<ICity>;
    // });

    // this.http.get('./assets/airports.json').subscribe(data => {
    //   // console.log('cities');
    //   // console.log(data);
    //   this.airports = data as Array<IAirport>;
    // });

    this.orderForm.get('departureCountry')?.valueChanges.subscribe(data => {
      this.filteredCities$.next(this.cities.filter(city => city.countryId === data.id))
      this.orderForm.controls['departureCity'].reset('');
      // console.log('data from orderForm, ', data)
    })

    this.orderForm.get('departureCity')?.valueChanges.subscribe(data => {
      const newPorts = this.airports.filter(airport => airport.cityId === data.id);
      // console.log(newPorts);

      // if(newPorts.length === 0){
      //   console.log(data.id);
        
      // }
      
      this.filteredAirports$.next(newPorts)
      // console.log('data from ocity, ', data)
    })
  }

};
