import { Component, OnInit } from '@angular/core';
// import { OrderDataService } from '../order-data-service.service';
import { OrderDataService } from '../core/services/order-data/order-data-service.service';

@Component({
  selector: 'app-order-result',
  templateUrl: './order-result.component.html',
  styleUrls: ['./order-result.component.scss']
})
export class OrderResultComponent implements OnInit {

  // orderData

  constructor(private orderDataService: OrderDataService) { }

  ngOnInit(): void {
    this.orderDataService.currentOrderData.subscribe((data: any) => {
      console.log('data is', data);
      
    })
  }

}
