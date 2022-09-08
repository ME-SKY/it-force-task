import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Airport, AllowedDirection, City, Country, Nationality } from 'src/app/mock.model';

export interface Resources {
  countries: Country[],
  cities: City[],
  airports: Airport[],
  allowedDirections: AllowedDirection[],
  nationalities: Nationality[]
}

@Injectable({ providedIn: 'root' })
export class SharedResourcesService {

  private sharedResourses = new BehaviorSubject<null | Resources>(null);
  resources = this.sharedResourses.asObservable();

  constructor() {
  }

  updateData(data: Resources) {
    this.sharedResourses.next(data);
  }
}
