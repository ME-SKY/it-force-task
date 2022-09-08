import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MockService } from './mock.service';
import { Resources, SharedResourcesService } from './core/services/shared-resources-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title = 'entityMappingToView';
  resourcesLoaded: boolean = false;

  constructor(
    private dataService: MockService,
    private sharedResources: SharedResourcesService){
  }

  ngOnInit(){
    forkJoin([
      this.dataService.getCountries(),
      this.dataService.getCities(),
      this.dataService.getAirports(),
      this.dataService.getAllowedDirections(),
      this.dataService.getNationalities()
    ]).subscribe(([countriesData, citiesData, airportsData, allowedDirectionsData, nationalitiesData]) => {
      const resources: Resources = {
        countries: [],
        cities: [],
        airports: [],
        allowedDirections: [],
        nationalities: []
      };

       resources.nationalities = nationalitiesData;

       resources.airports = airportsData;
       resources.allowedDirections = allowedDirectionsData;
 
       const [citiesFromIds, citiesToIds] = [
         allowedDirectionsData.map(direction => direction.cityFromId),
         allowedDirectionsData.map(direction => direction.cityToId)
       ];
 
       const availableCityIds = new Set([...citiesFromIds, ...citiesToIds]); //all uniq values from allowed directions
       const airportCityIds = airportsData.map(airport => airport.cityId);
 
       //realy available cities to select, based on available to select cities getted from allowed directions 
       //- check that city exists in allowed directions and it has airports 
       const citiesToUse = citiesData.filter(city => (availableCityIds.has(city.id)) && (airportCityIds.includes(city.id)));
       resources.cities = citiesToUse;
 
       const availableCountryIds = citiesToUse.map(city => city.countryId);
 
       //realy available to select countries based on available cities
       const countriesToUse = countriesData.filter(country => availableCountryIds.includes(country.id)); 
       resources.countries = countriesToUse;

       this.sharedResources.updateData(resources);
       this.resourcesLoaded = true;
    });
  }
}
