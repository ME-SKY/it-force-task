import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { filter } from 'rxjs';
import { OrderDataService } from '../core/services/order-data-service.service';
import { Resources, SharedResourcesService } from '../core/services/shared-resources-service.service';

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
      
      this.orderData.departureDate = moment(departureDate).format('DD.MM.YYYY');
      this.orderData.arrivalDate = moment(arrivalDate).format('DD.MM.YYYY');
      this.orderData.passengers = passengers;
    })
  }

}
