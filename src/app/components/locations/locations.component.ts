import { Component } from '@angular/core';
import {Subscription} from 'rxjs';
import {Location} from '../../model/location';
import {LocationsService} from '../../services/locations.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent {
  locationsSubscription: Subscription;
  selectedLocationSubscription: Subscription;

  locations: Location[];
  locationsByCategory: any;
  selectedLocationName: string;
  locationsSorting = {};
  selectedCategoryName: string;

  constructor(private locationsService: LocationsService) {
    this.locationsSubscription = this.locationsService.getLocations().subscribe( (result) => {
      this.locations = result;
      if (this.locationsSorting['groupByCategoryClose']) {
        this.showLocationsGroupedByCategoryClose();
      } else if (this.locationsSorting['groupByCategory']) {
        this.showLocationsGroupedByCategoryOpen();
      } else {
        this.showLocationsAlphbetical();
      }
    });

    this.selectedLocationSubscription = this.locationsService.getSelectedLocation().subscribe( (result) => {
      this.selectedLocationName = result ? result.name : null;
    });
  }

  selectLocation(name: string) {
    this.selectedLocationName = name;
    this.locationsService.setSelectedLocation(name);
  }

  clearLocationSorting() {
    this.selectedCategoryName = null;
    this.locationsSorting = {};
  }

  sortAlphabetically(list: any[]) {
    return _.sortBy(list, ['name'], ['desc']);
  }

  showLocationsGroupedByCategoryOpen() {
    this.clearLocationSorting();
    this.locationsSorting['groupByCategory'] = true;
    this.showLocationsGroupedByCategory();
  }

  showLocationsGroupedByCategoryClose() {
    this.clearLocationSorting();
    this.locationsSorting['groupByCategoryClose'] = true;
    this.showLocationsGroupedByCategory();
  }

  showLocationsGroupedByCategory() {
    const locationsByCategory = _.chain(this.locations)
      .groupBy('category')
      .toPairs()
      .value();

    const locationsByCategoryAlphabetically = _.sortBy(locationsByCategory, [0], ['desc']);

    for (let i = 0; i < locationsByCategoryAlphabetically.length; i++) {
      const locationList = this.sortAlphabetically(locationsByCategoryAlphabetically[i][1]);
      locationsByCategoryAlphabetically[i][1] = locationList;
    }

    this.locationsByCategory = locationsByCategoryAlphabetically;
  }

  showLocationsAlphbetical() {
    const locationsByAlphbet = _.sortBy(this.locations, ['name'], ['desc']);
    this.locations = locationsByAlphbet;
    this.clearLocationSorting();
    this.locationsSorting['alphabetical'] = true;
  }

  openCategoryLocations(categoryName: string) {
    this.selectedCategoryName = categoryName;
    console.log('categoryName: ', categoryName);
  }
}
