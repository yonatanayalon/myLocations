import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Location} from '../model/location';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  private locationsSubject = new BehaviorSubject<any>(Observable);
  private selectedLocationSubject = new Subject<any>();

  locations: Location[];
  selectedLocationName: string;
  selectedLocation: Location;

  constructor(private http: HttpClient) { }

  setSelectedLocation(name) {
    this.selectedLocationName = name;
    this.selectedLocation = (this.locations.filter( (item) => {
      return item.name === name;
    }))[0];
    this.selectedLocationSubject.next({name: this.selectedLocation.name, address: this.selectedLocation.address, coordinates: this.selectedLocation.coordinates, category: this.selectedLocation.category});
  }

  clearSelectedLocation() {
    this.selectedLocationName = '';
    this.selectedLocation = null;
    this.selectedLocationSubject.next();
  }

  getSelectedLocation(): Observable<any> {
    return this.selectedLocationSubject.asObservable();
  }

  getLocations(): Observable<any> {
    const localStorageData = localStorage.getItem('locations')
    this.locations = localStorageData ? JSON.parse(localStorageData) : [];
    this.locationsSubject.next(this.locations);

    return this.locationsSubject.asObservable();
  }

  saveToLocalStorage() {
    const stringifiedyData = JSON.stringify(this.locations);
    localStorage.setItem('locations', stringifiedyData);
  }

  addLocation(locationData) {
    const locations = this.locations;

    const newLocation: Location = {name: locationData.name, address: locationData.address, coordinates: locationData.coordinates, category: locationData.category};

    locations.push(newLocation);

    this.saveToLocalStorage();

    this.locationsSubject.next(locations);
  }

  getSelectionIndex() {
    return this.locations.map((e) => { return e.name; }).indexOf(this.selectedLocation.name);
  }

  editLocation(locationData) {
    const updatedLocation: Location = {name: locationData.name, address: locationData.address, coordinates: locationData.coordinates, category: locationData.category};

    const selectedLocationIndex = this.getSelectionIndex();

    this.locations[selectedLocationIndex] = updatedLocation;

    this.saveToLocalStorage();

    this.locationsSubject.next(this.locations);
  }

  removeLocation() {
    const selectedLocationIndex = this.getSelectionIndex();
    this.locations.splice(selectedLocationIndex, 1);
    this.locationsSubject.next(this.locations);
    this.saveToLocalStorage();
  }
}
