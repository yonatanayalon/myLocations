import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CategoriesService} from '../../services/categories.service';
import {Category} from '../../model/category';
import {Subscription} from 'rxjs';
import {LocationsService} from '../../services/locations.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-header-toolbar',
  templateUrl: './header-toolbar.component.html',
  styleUrls: ['./header-toolbar.component.scss']
})
export class HeaderToolbarComponent implements OnInit {
  @ViewChild('content') content: any;

  categoriesSubscription: Subscription;
  selectedCategorySubscription: Subscription;
  selectedLocationSubscription: Subscription;

  categories: Category[];
  selectedModalCategory: string;
  pageName: string;
  modalContent: any;
  selectedItem: any;
  registerForm: FormGroup;

  constructor(private activeRoute: ActivatedRoute, private router: Router, private modalService: NgbModal,
              private categoriesService: CategoriesService, private locationsService: LocationsService,
              private formBuilder: FormBuilder) {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd ) {
        this.pageName = event.url.replace('/', '');
        this.pageName = (this.pageName === '') ? 'Categories' : this.pageName;
      }
    });

    this.categoriesSubscription = this.categoriesService.getCategories().subscribe( (result) => {
      this.categories = result;
    });

    this.selectedCategorySubscription = this.categoriesService.getSelectedCategory().subscribe( (result) => {
      this.selectedItem = result;
    });

    this.selectedLocationSubscription = this.locationsService.getSelectedLocation().subscribe( (result) => {
      this.selectedItem = result;
    });
  }

  clearSelected() {
    this.categoriesService.clearSelectedCategory();
    this.locationsService.clearSelectedLocation();
    this.selectedModalCategory = null;
  }

  selectCategory(name: string) {
    this.selectedModalCategory = name;
    this.registerForm.get('category').setValue(name);
  }

  resetFormControls() {
    this.registerForm.removeControl('address');
    this.registerForm.removeControl('coordinates');
    this.registerForm.removeControl('category');
  }

  getModalSettings(section: string, action: string) {
    this.resetFormControls();

    let settings: any;
    if (section === 'Categories') {
      settings = {
        addMethod: (data) => {
          this.categoriesService.addCategory(data);
        },
        removeMethod: () => {
          this.categoriesService.removeCategory();
        },
        editMethod: (data) => {
          this.categoriesService.editCategory(data);
        },
        modalContent: {
          name: action === 'add' ? '' : this.selectedItem ? this.selectedItem.name : '',
          title: action,
          actionName: action
        }
      };
    }
    else {
      this.selectedModalCategory = this.selectedItem ? this.selectedItem.category : 'Choose Category';
      settings = {
        addMethod: (data) => {
          data.category = this.selectedModalCategory;
          this.locationsService.addLocation(data);
        },
        removeMethod: () => {
          this.locationsService.removeLocation();
        },
        editMethod: (data) => {
          data.category = this.selectedModalCategory;
          this.locationsService.editLocation(data);
        },
        modalContent: {
          name: action === 'add' ? '' : this.selectedItem ? this.selectedItem.name : '',
          address: action === 'add' ? '' : this.selectedItem ? this.selectedItem.address : '',
          coordinates: action === 'add' ? '' : this.selectedItem ? this.selectedItem.coordinates : '',
          categories: this.categories,
          title: action,
          actionName: action
        }
      };
      this.registerForm.addControl('address', new FormControl(settings.modalContent.address, Validators.required));
      this.registerForm.addControl('coordinates', new FormControl(settings.modalContent.coordinates, Validators.required));
      this.registerForm.addControl('category', new FormControl((this.selectedItem ? this.selectedItem.category : null), Validators.required));
    }

    this.registerForm.get('name').setValue(settings.modalContent.name);

    return settings;
  }

  openModal(action: string) {
    const modalSettings = this.getModalSettings(this.pageName, action);
    this.modalContent = modalSettings.modalContent;

    const modalRef = this.modalService.open( this.content);
    modalRef.result.then((result) => {
      // Save modal data
      switch (action) {
        case 'add': {
          modalSettings.addMethod(this.registerForm.value);
          break;
        }
        case 'remove': {
          modalSettings.removeMethod(this.registerForm.value);

          break;
        }
        case 'edit': {
          modalSettings.editMethod(this.registerForm.value);
          break;
        }
        default: {
          break;
        }
      }
      this.categoriesService.clearSelectedCategory();
      this.clearSelected();
    }).catch((error) => {
      this.clearSelected();
    });
  }

  saveModal(modal, newContent) {
    modal.close(newContent);
  }

  get formControls() { return this.registerForm.controls; }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

}
