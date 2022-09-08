import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const ORDER_DATA_STORAGE_KEY = 'orderData';

@Injectable({ providedIn: 'root' })
export class OrderDataService {

  private orderData: any = new BehaviorSubject(null);
  currentOrderData = this.orderData.asObservable();

  constructor() {
    const savedData = this.getDataFromStorage();
    if (savedData) {
      this.orderData.next(savedData);
    }
  }

  updateOrderData(data: any) {
    data && this.setDataToStorage(data);
    this.orderData.next(data);
  }

  cleanLocalStorage(){
    localStorage.removeItem(ORDER_DATA_STORAGE_KEY);
    // this.orderData.next(null);
  }

  getDataFromLocalStorage(){
    return this.getDataFromStorage();
  }

  private setDataToStorage(data: Object) {
    console.log('set to storage');

    const stringifiedData = JSON.stringify(data);
    localStorage.setItem(ORDER_DATA_STORAGE_KEY, stringifiedData);
  }

  private getDataFromStorage() {
    console.log('get from storage');
    
    const data = localStorage.getItem(ORDER_DATA_STORAGE_KEY);

    if(data){
      console.log('parsedData', JSON.parse(data));
    }
    
    
    // 

    return data ? JSON.parse(data) : null;
  }

}
