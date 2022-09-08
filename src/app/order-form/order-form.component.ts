import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BehaviorSubject, filter, Subject } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PASSENGER_DOCUMENT_TYPE_LABELS } from '../core/consts';
import { getFormValidationErrors } from '../core/helpers';
import { OrderDataService } from '../core/services/order-data-service.service';
import { SharedResourcesService } from '../core/services/shared-resources-service.service';
import { passportExpirationValidator, validateBirthdate } from '../core/validators';
import { Airport, AllowedDirection, City, Country, Nationality, PassengerDocumentType } from '../mock.model';
import { CreateNewFormDialog } from './create-new-form-dialog/create-new-form-dialog.component';


@Component({
  selector: 'order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnInit {

  constructor(private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private orderDataService: OrderDataService,
    private route: Router,
    private sharedResources: SharedResourcesService,
    private dialog: MatDialog
  ) {
  }

  formData: any = null;
  formDataSub = new Subject();

  countries: Country[] = [];
  cities: City[] = [];
  allowedDirections: AllowedDirection[] = [];
  airports: Airport[] = [];
  nationalities: Nationality[] = [];

  passengerDocumentTypes = Object.keys(PassengerDocumentType)
    .filter((v) => isNaN(Number(v)))
    .map((name) => {
      const value = PassengerDocumentType[name as keyof typeof PassengerDocumentType];

      return {
        value: PassengerDocumentType[name as keyof typeof PassengerDocumentType],
        label: PASSENGER_DOCUMENT_TYPE_LABELS[value],
      };
    });

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
      return valid ? null : { wrongTravelDates: 'departure date is same or after arrival date' };
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

  createPassenger(): FormGroup {
    return this.fb.group({
      documentType: ['', Validators.required],
      lName: ['', Validators.required],
      fName: ['', Validators.required],
      nationalityId: ['', Validators.required],
      passportNo: ['', Validators.required],
      passportDateOfExpire: ['', [Validators.required, passportExpirationValidator]],
      birthdate: ['', [Validators.required, validateBirthdate]],
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

  submitFormAction() {
    this.orderDataService.updateOrderData(this.orderForm.value);


    if (!this.orderForm.valid) {
      const errors = getFormValidationErrors(this.orderForm).map(err => `${err.control} - ${err.error}`).join('\r\n');
      this._snackBar.open(errors, 'Understand');
    } else {
      this.orderDataService.cleanLocalStorage();
      this._snackBar.open('Form submition complete!', 'ОК', {
        duration: 2000
      })
      this.route.navigate(['order-result']);
    }
  }



  ngOnInit(): void {
    this.formData = this.orderDataService.getDataFromLocalStorage();

    if (this.formData) {
      this.orderForm.patchValue(this.formData);
      this.openDialog()
    }

    this.sharedResources.resources.subscribe((resources) => {
      if (resources) {
        const { cities, countries, nationalities, allowedDirections, airports } = resources;
        this.countries = countries;
        this.cities = cities;
        this.allowedDirections = allowedDirections;
        this.nationalities = nationalities;
        this.airports = airports;

        const [citiesFromIds, citiesToIds] = [
          allowedDirections.map(direction => direction.cityFromId),
          allowedDirections.map(direction => direction.cityToId)
        ];

        const citiesFrom = cities.filter(city => citiesFromIds.includes(city.id));
        const citiesTo = cities.filter(city => citiesToIds.includes(city.id));

        const countryIdsFromCities = new Set(citiesFrom.map(city => city.countryId));
        const countryIdsToCities = new Set(citiesTo.map(city => city.countryId));

        this.filteredDepartureCountries$.next(this.countries.filter(country => countryIdsFromCities.has(country.id)));
        this.filteredArrivalCountries$.next(this.countries.filter(country => countryIdsToCities.has(country.id)));
      }
    })

    this.orderForm.statusChanges.subscribe(_ => {
      this.orderDataService.updateOrderData(this.orderForm.value);
    })

    this.orderForm.get('departureCountry')?.valueChanges
      .pipe(filter(value => (typeof value !== 'string') && value !== null))
      .subscribe((data: Country) => {
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
      .pipe(filter(value => (typeof value !== 'string') && value !== null))
      .subscribe((data: City) => {
        this.filteredDepartureAirports$.next(this.airports.filter(airport => airport.cityId === data.id));
      });

    this.orderForm.get('arrivalCountry')?.valueChanges
      .pipe(filter(value => (typeof value !== 'string') && value !== null))
      .subscribe((data: Country) => {
        this.filteredArrivalCities$.next(this.cities.filter(city => city.countryId === data.id));
      });

    this.orderForm.get('arrivalCity')?.valueChanges
      .pipe(filter(value => (typeof value !== 'string') && value !== null))
      .subscribe((data: City) => {
        this.filteredArrivalAirports$.next(this.airports.filter(airport => airport.cityId === data.id));
      })
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '200px';
    dialogConfig.width = '300px';

    const dialogRef = this.dialog.open(CreateNewFormDialog, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        if (data) {
          this.orderForm.patchValue(this.formData);
        } else {
          this.orderForm.reset();
          this.orderDataService.cleanLocalStorage();
        }
      }
    );
  }

};
