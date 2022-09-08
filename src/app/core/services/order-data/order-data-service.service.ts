import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const ORDER_DATA_STORAGE_KEY = 'orderData';

@Injectable({ providedIn: 'root' })
export class OrderDataService {

  private orderData = new BehaviorSubject(null);
  currentOrderData = this.orderData.asObservable();

  constructor() {
    const savedData = this.getDataFromStorage();
    if (savedData) {
      this.orderData.next(savedData);
    }
  }

  updateOrderData(data: any) {
    console.log('data is update in service', data);

    this.setDataToStorage(data);
    this.orderData.next(data);
  }

  private setDataToStorage(data: Object) {
    // console.log('type', data?.value);

    const stringifiedData = JSON.stringify(data);
    localStorage.setItem(ORDER_DATA_STORAGE_KEY, stringifiedData);
  }

  private getDataFromStorage() {
    const data = localStorage.getItem(ORDER_DATA_STORAGE_KEY);
    localStorage.removeItem(ORDER_DATA_STORAGE_KEY);

    return data ? JSON.parse(data) : null;
  }

}
