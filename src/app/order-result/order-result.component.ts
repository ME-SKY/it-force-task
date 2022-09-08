import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, filter } from 'rxjs';
// import { OrderDataService } from '../order-data-service.service';
import { OrderDataService } from '../core/services/order-data/order-data-service.service';
import { Resources, SharedResourcesService } from '../core/services/order-data/shared-resources-service.service';
import { Passenger } from '../mock.model';

// {
//   "departureCountry": {
//       "id": 200,
//       "name": "Грузия",
//       "systemName": "Грузия",
//       "defaultCurrencyId": 1,
//       "isDeleted": false
//   },
//   "departureCity": {
//       "id": 985,
//       "name": "Батуми",
//       "iata": null,
//       "systemName": "Батуми",
//       "countryId": 200,
//       "isDeleted": false
//   },
//   "departureAirport": {
//       "id": 630,
//       "parentId": 0,
//       "name": "Батуми",
//       "iata": "BUS",
//       "isVirtual": false,
//       "icao": null,
//       "altitude": null,
//       "latitude": null,
//       "longitude": null,
//       "timezone": null,
//       "systemName": "Батуми",
//       "cityId": 985,
//       "isDeleted": true
//   },
//   "arrivalCountry": {
//       "id": 199,
//       "name": "Греция",
//       "systemName": "Греция",
//       "defaultCurrencyId": 2,
//       "isDeleted": false
//   },
//   "arrivalCity": {
//       "id": 955,
//       "name": "Корфу",
//       "iata": null,
//       "systemName": "Корфу",
//       "countryId": 199,
//       "isDeleted": false
//   },
//   "arrivalAirport": {
//       "id": 334,
//       "parentId": 0,
//       "name": "Kerkyra Corfu",
//       "iata": "CFU",
//       "isVirtual": false,
//       "icao": "LGKR",
//       "altitude": null,
//       "latitude": 39.60784,
//       "longitude": 19.914644,
//       "timezone": 2,
//       "systemName": "Kerkyra Corfu",
//       "cityId": 955,
//       "isDeleted": false
//   },
//   "departureDate": "2022-09-07T14:00:00.000Z",
//   "arrivalDate": "2022-09-13T14:00:00.000Z",
//   "passengers": [
//       {
//           "documentType": 2,
//           "lName": "wef",
//           "fName": "wef",
//           "nationalityId": 2,
//           "passportNo": "wef23f",
//           "passportDateOfExpire": "2025-06-10T14:00:00.000Z",
//           "birthdate": "1998-02-09T14:00:00.000Z",
//           "sex": "wef"
//       }
//   ]
// }

interface OrderPresentation{
  departurePlace: string,
  arrivalPlace: string,
  departureDate: any,
  arrivalDate: any,
  passengers: any []
}

@Component({
  selector: 'app-order-result',
  templateUrl: './order-result.component.html',
  styleUrls: ['./order-result.component.scss']
})
export class OrderResultComponent implements OnInit {

  resourses: null | Resources = null;
  orderData: OrderPresentation | null = null;

  constructor(
    private orderDataService: OrderDataService,
    private sharedRecources: SharedResourcesService) { }

  ngOnInit(): void {
    this.sharedRecources.resources.subscribe(resourcesData => {
      this.resourses = resourcesData;
    })
    this.orderDataService.currentOrderData.pipe(filter(data => data !== null)).subscribe((data: any) => {
      const {departureCity, 
            departureCountry, 
            departureAirport, 
            departureDate, 
            passengers, 
            arrivalCountry, 
            arrivalCity, 
            arrivalAirport, 
            arrivalDate} = data;

      const departurePlace = `${departureCountry.name}, ${departureCity.name}, ${departureAirport.name}`;
      const arrivalPlace = `${arrivalCountry.name}, ${arrivalCity.name}, ${arrivalAirport.name}`;

      this.orderData = {} as OrderPresentation;

      this.orderData.departurePlace = departurePlace;
      this.orderData.arrivalPlace = arrivalPlace;
      this.orderData.departureDate = departureDate;
      this.orderData.arrivalDate = arrivalDate;
      this.orderData.passengers = passengers;

      
      // console.log('data is', data);
    })
  }

}
