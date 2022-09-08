import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BehaviorSubject, debounceTime, filter, forkJoin } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Airport, AllowedDirection, City, Country, Nationality, PassengerDocumentType } from '../mock.model';
import { MockService } from '../mock.service';
import { OrderDataService } from '../core/services/order-data/order-data-service.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PASSENGER_DOCUMENT_TYPE_LABELS } from '../core/consts';

export interface IFormError {
  control: string;
  error?: string;
  errors?: IFormError[];
  value: any;
}


export function getFormValidationErrors(form: FormGroup) {
  const result: IFormError[] = [];

  Object.keys(form.controls).forEach(key => {
    const formProperty = form.get(key);
    if (formProperty instanceof FormGroup) {
      result.push(...getFormValidationErrors(formProperty))
    }

    //@ts-ignore
    const controlErrors: ValidationErrors = formProperty.errors;

    if (controlErrors) {
      Object.keys(controlErrors).forEach(keyError => {
        result.push({
          'control': key,
          'error': keyError,
          'value': controlErrors[keyError]
        });
      });
    }
  });

  return result;
}


@Component({
  selector: 'order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private dataService: MockService,
    private _snackBar: MatSnackBar,
    private orderDataService: OrderDataService,
    private route: Router
    ) {
  }

  countries: Country[] = [];
  cities: City[] = [];
  allowedDirections: AllowedDirection[] = [];
  airports: Airport[] = [];
  nationalities: Nationality[] = [];
  // passengerDocumentTypes = {
  //   ...PassengerDocumentType
  // }
  passengerDocumentTypes = Object.keys(PassengerDocumentType) //todo move it to pipe
    .filter((v) => isNaN(Number(v)))
    .map((name) => {
      const value = PassengerDocumentType[name as keyof typeof PassengerDocumentType];
     
      return {
        value: PassengerDocumentType[name as keyof typeof PassengerDocumentType],
        label: PASSENGER_DOCUMENT_TYPE_LABELS[value],
      };
    });

  orderFormValid: boolean = false;
  orderFormErrors = [];

  filteredDepartureCities$: BehaviorSubject<City[]> = new BehaviorSubject(this.cities);
  filteredDepartureCountries$: BehaviorSubject<Country[]> = new BehaviorSubject(this.countries);
  filteredDepartureAirports$: BehaviorSubject<Airport[]> = new BehaviorSubject(this.airports);

  filteredArrivalCities$: BehaviorSubject<City[]> = new BehaviorSubject(this.cities);
  filteredArrivalCountries$: BehaviorSubject<Country[]> = new BehaviorSubject(this.countries);
  filteredArrivalAirports$: BehaviorSubject<Airport[]> = new BehaviorSubject(this.airports);


  travelDatesValidator(control: AbstractControl): ValidationErrors | null {
    const departureDate = control.get('departureDate');
    const arrivalDate = control.get('arrivalDate');

    if ((departureDate?.value) && (arrivalDate?.value)) {
      const valid = moment(departureDate.value).isBefore(arrivalDate.value);

      !valid && console.log({ wrongTravelDates: 'departure date is same or after arrival date' })

      return valid ? null : { wrongTravelDates: 'departure date is same or after arrival date' };
    }
    return null;
  }


  passportExpirationValidator(control: AbstractControl): { [key: string]: any } | null {

    if (moment.isMoment(control.value)) {
      const dateExpiration = moment().add(6, 'month');
      const valid = moment(control.value).isSameOrBefore(dateExpiration);
      return valid ? null : { passportDateOfExpire: { value: 'Passport must be valid for six months' } }
    }
    return null;
  }

  orderForm = this.fb.group({
    departureCountry: ['', Validators.required],
    departureCity: ['', Validators.required],
    departureAirport: ['', Validators.required],
    arrivalCountry: ['', Validators.required],
    arrivalCity: ['', Validators.required],
    arrivalAirport: ['', Validators.required],
    departureDate: ['', Validators.required],
    arrivalDate: ['', Validators.required],
    passengers: this.fb.array([this.createPassenger()])
  }, { validators: this.travelDatesValidator, updateOn: 'change' });

  get passengers(): FormArray {
    return this.orderForm.get('passengers') as FormArray;
  }

  // checkVilidity(){
  // Object.keys(this.orderForm.controls).forEach((control: string) => {
  //   const typedControl: AbstractControl = this.orderForm.controls[control];
  //   console.log(typedControl.has)
  // should log the form controls value and be typed correctly
  // });
  // }

  validateBirthdate(control: AbstractControl): { [key: string]: any } | null {
    if (control.value?.['year']) {
      const currentYear = new Date().getFullYear();
      const valid = ((currentYear - control.value.year()) > 20);
      return valid ? null : { birthdate: { value: 'should be more than 20 years old' } }
    }
    return null;
  }

  createPassenger(): FormGroup {
    return this.fb.group({
      documentType: ['', Validators.required],
      lName: ['', Validators.required],
      fName: ['', Validators.required],
      nationalityId: ['', Validators.required],
      passportNo: ['', Validators.required],
      passportDateOfExpire: ['', Validators.required],
      birthdate: ['', [Validators.required, this.validateBirthdate]],
      sex: ['', Validators.required],
    })
  }

  deletePassenger(param: any) {
    this.passengers.removeAt(param);
  }

  displayCountryName(country: Country): string {
    return country?.name;
  }

  displayCityName(city: City): string {
    return city?.name;
  }

  displayAirportName(airport: City): string {
    return airport?.name;
  }

  addPassenger() {
    this.passengers.push(this.createPassenger());
  }

  // formValid(){
  // }

  submitFormAction() {
    

    // console.log(errors);

    this.orderDataService.updateOrderData(this.orderForm.value);
    

    if (!this.orderForm.valid) {
      const errors = getFormValidationErrors(this.orderForm).map(err => `${err.control} - ${err.error}`).join('\r\n');
      this._snackBar.open(errors, 'Understand')
    } else {
      this._snackBar.open('Form submition complete!', 'ОК', {
        duration: 2000
      })
      this.route.navigate(['order-result']);
    }
  }



  ngOnInit(): void {
    this.orderForm.statusChanges.subscribe(_ => {
      this.orderDataService.updateOrderData(this.orderForm.value);
    })


    // console.log(this.orderForm.errors);

    // if(this.orderForm.touched){
    //   const currentYear = new Date().getFullYear();
    //   console.log('currentYear', currentYear);

    //   const birthdate = this.passengers.controls[0].get('birthdate')?.value
    //   console.log('birthdate', birthdate.year());

    //   const rigthAgeAllPassengers = this.passengers.controls
    //   .every(passenger => {
    //     const passengerBirthYear = passenger.get('birthdate')?.value?.year?.();

    //     return passengerBirthYear ? ((currentYear - passengerBirthYear) > 20) : false;
    //   })

    //   console.log('rigthAgeAllPassengers', rigthAgeAllPassengers);

    // }


    // })
    // console.log('passengerDocumentTypes', this.passengerDocumentTypes);

    forkJoin([
      this.dataService.getCountries(),
      this.dataService.getCities(),
      this.dataService.getAirports(),
      this.dataService.getAllowedDirections(),
      this.dataService.getNationalities()
    ]).subscribe(([countriesData, citiesData, airportsData, allowedDirectionsData, nationalitiesData]) => {

      //todo refactor this

      this.nationalities = nationalitiesData;

      this.airports = airportsData;
      this.allowedDirections = allowedDirectionsData;

      //todo maybe should use Set on this to get only uniq in both collections
      const [citiesFromIds, citiesToIds] = [
        allowedDirectionsData.map(direction => direction.cityFromId),
        allowedDirectionsData.map(direction => direction.cityToId)
      ];


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
      .subscribe((data: Country) => {
        // todo need to change something to do it more simple, need to modificate source collections(use modificated copies of source arrays)
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
      .subscribe((data: City) => {
        this.filteredDepartureAirports$.next(this.airports.filter(airport => airport.cityId === data.id));
      });

    this.orderForm.get('arrivalCountry')?.valueChanges
      .pipe(filter(value => typeof value !== 'string'))
      .subscribe((data: Country) => {
        this.filteredArrivalCities$.next(this.cities.filter(city => city.countryId === data.id));
      });

    this.orderForm.get('arrivalCity')?.valueChanges
      .pipe(filter(value => typeof value !== 'string'))
      .subscribe((data: City) => {
        this.filteredArrivalAirports$.next(this.airports.filter(airport => airport.cityId === data.id));
      })


  }

};
