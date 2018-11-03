import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {Category} from '../model/category';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private categoriesSubject = new BehaviorSubject<any>(Observable);
  private selectedCategorySubject = new Subject<any>();
  categories: Category[];
  selectedCategoryIndex: number;
  selectedCategory: Category;

  constructor(private http: HttpClient) { }

  setSelectedCategory(index) {
    this.selectedCategoryIndex = index;
    this.selectedCategory = this.categories[index];
    this.selectedCategorySubject.next({name: this.selectedCategory.name, index: index});
  }

  clearSelectedCategory() {
    this.selectedCategoryIndex = -1;
    this.selectedCategory = null;
    this.selectedCategorySubject.next();
  }

  getSelectedCategory(): Observable<any> {
    return this.selectedCategorySubject.asObservable();
  }

  getCategories(): Observable<any> {
    const localStorageData = localStorage.getItem('categories')
    this.categories = localStorageData ? JSON.parse(localStorageData) : [];
    this.categoriesSubject.next(this.categories);

    return this.categoriesSubject.asObservable();
  }

  saveToLocalStorage() {
    const stringifiedyData = JSON.stringify(this.categories);
    localStorage.setItem('categories', stringifiedyData);
  }

  addCategory(categoryData: any) {
    const categories = this.categories;

    categories.push({name: categoryData.name});

    this.saveToLocalStorage();

    this.categoriesSubject.next(categories);
  }

  editCategory(categoryData: any) {
    this.categories[this.selectedCategoryIndex] = {name: categoryData.name};

    this.saveToLocalStorage();

    this.categoriesSubject.next(this.categories);
  }

  removeCategory() {
    this.categories.splice(this.selectedCategoryIndex, 1);
    this.categoriesSubject.next(this.categories);
    this.saveToLocalStorage();
  }
}
