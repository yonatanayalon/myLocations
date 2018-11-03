import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CategoriesService} from '../../services/categories.service';
import {Subscription} from 'rxjs';
import {Category} from '../../model/category';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {
  categoriesSubscription: Subscription;
  selectedCategorySubscription: Subscription;

  categories: Category[];
  selectedCategoryIndex: number;

  constructor(private categoriesService: CategoriesService) {
    this.categoriesSubscription = this.categoriesService.getCategories().subscribe( (result) => {
      this.categories = result;
    });

    this.selectedCategorySubscription = this.categoriesService.getSelectedCategory().subscribe( (result) => {
      this.selectedCategoryIndex = result ? result.index : null;
    });
  }

  selectCategory(index: number) {
    this.selectedCategoryIndex = index;
    this.categoriesService.setSelectedCategory(index);
  }
}
