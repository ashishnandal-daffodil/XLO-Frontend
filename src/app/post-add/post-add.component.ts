import { Component, OnInit } from "@angular/core";
import { FlatTreeControl } from "@angular/cdk/tree";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { HttpService } from "../utils/service/http/http.service";
import { LoaderService } from "../utils/service/loader/loader.service";
import { SnackbarService } from "../utils/service/snackBar/snackbar.service";
import { errorMessages } from "../utils/helpers/error-messages";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LocalStorageService } from "../utils/service/localStorage/local.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LocationService } from "../utils/service/location/location.service";
import { successMessages } from "../utils/helpers/success-messages";
import { CurrencyPipe } from "@angular/common";
import * as converter from "written-number";
import { environment } from "src/environments/environment";
import { CommonAPIService } from "../utils/commonAPI/common-api.service";
interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

interface Country {
  shortName: string;
  name: string;
}

interface Photo {
  imageUrl: string;
  file: string;
}

@Component({
  selector: "app-post-add",
  templateUrl: "./post-add.component.html",
  styleUrls: ["./post-add.component.css"]
})
export class PostAddComponent implements OnInit {
  private _transformer = (node, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level
    };
  };

  treeControl = new FlatTreeControl<FlatNode>(
    node => node["level"],
    node => node["expandable"]
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  categoryForm = new FormGroup({});
  detailsForm = new FormGroup({});
  reviewDetailsForm = new FormGroup({});

  productId = null;
  allCategories = [];
  selectedCategory: string = null;
  selectedSubCategory: string = null;
  imageUrls = [];
  loggedInUser: any;
  imgSrc: string;
  nameInitials: string = "";
  countries: Country[];
  selectedCountry: string = "IN";
  states: string[];
  selectedState: string;
  cities: string[];
  selectedCity: string;
  photos: Photo[] = [];
  owners = ["First", "Second", "Third", "Other"];
  priceInWords: string;
  uploadedProductDetail: any = {};
  isEditMode: boolean = false;
  selectedIndex = 0;
  existingProductDetails: any;
  updatedProductDetails: any;
  newImagesAdded = [];
  deletedExistingImages = { deletedImages: [] };

  constructor(
    private httpService: HttpService,
    private loaderService: LoaderService,
    private snackBarService: SnackbarService,
    private formBuilder: FormBuilder,
    private localStorageService: LocalStorageService,
    private router: Router,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private commonAPIService: CommonAPIService
  ) {}

  get product() {
    return this.uploadedProductDetail;
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.queryParamMap.get("productId");
    if (this.productId) {
      this.isEditMode = true;
      this.commonAPIService.getProductDetails(this.productId).then(productDetails => {
        this.existingProductDetails = productDetails;
        this.patchProductDataToForm(productDetails);
        this.selectedIndex = 1;
      });
    }
    this.loggedInUser = this.localStorageService.getItem("loggedInUser");
    this.getCategories();
    this.getLocationsData();
    this.categoryForm = this.formBuilder.group({
      category: ["", Validators.required],
      subCategory: ["", Validators.required]
    });
    this.initializeForms().then(result => {
      this.disableFields();
    });
    this.detailsForm.get("country").setValue(this.selectedCountry);
    this.states = this.locationService.getStatesByCountry(this.selectedCountry);
    this.detailsForm.controls.state.valueChanges.subscribe(state => {
      this.detailsForm.controls.city.reset();
      if (state) {
        this.selectedState = state;
        this.cities = this.locationService.getCitiesByState(this.selectedCountry, state);
      }
    });
    this.detailsForm.controls.city.valueChanges.subscribe(city => {
      if (city) {
        this.selectedCity = city;
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.loggedInUser) {
      if (this.loggedInUser?.profile_image_filename) {
        this.imgSrc = `${environment.baseUrl}/users/profileimage/${this.loggedInUser.profile_image_filename}`;
      }
    }
  }

  patchProductDataToForm(res) {
    let { title, description, owner, price, location, photos, category, subcategory } = res;
    for (let photo of photos) {
      this.imageUrls.push(`${environment.baseUrl}/products/productimage/${photo}`);
    }
    let data = location.split(",");
    let city, state, country;
    if (data.length === 2) {
      state = data[0].trim();
      country = data[1].trim();
    } else {
      city = data[0].trim();
      state = data[1].trim();
      country = data[2].trim();
    }

    this.selectedCategory = category;
    this.selectedSubCategory = subcategory;
    this.selectedCountry = country;
    this.selectedState = state;

    this.categoryForm.patchValue({
      category: category,
      subCategory: subcategory
    });

    this.detailsForm.patchValue({
      title: title,
      description: description,
      owner: owner,
      price: price,
      country: country,
      state: state
    });

    if (city) {
      this.detailsForm.patchValue({
        city: city
      });
      this.selectedCity = city;
    }
  }

  initializeForms() {
    return new Promise((resolve, reject) => {
      this.detailsForm = this.formBuilder.group({
        title: ["", Validators.required],
        description: ["", Validators.required],
        owner: ["", Validators.required],
        price: ["", Validators.required],
        country: ["", Validators.required],
        state: ["", Validators.required],
        city: [""]
      });

      this.reviewDetailsForm = this.formBuilder.group({
        name: [this.loggedInUser.name],
        phoneNumber: [this.loggedInUser.mobile],
        email: [this.loggedInUser.email]
      });
      resolve(true);
    });
  }

  disableFields() {
    if (this.loggedInUser.mobile.length) {
      this.reviewDetailsForm.get("phoneNumber").disable({ onlySelf: true });
    }
    if (this.loggedInUser.name.length) {
      this.reviewDetailsForm.get("name").disable({ onlySelf: true });
    }
    if (this.loggedInUser.email.length) {
      this.reviewDetailsForm.get("email").disable({ onlySelf: true });
    }
  }

  getCategories() {
    return new Promise((resolve, reject) => {
      this.loaderService.showLoader();
      this.httpService.getRequest(`categories/allCategories/`).subscribe(
        res => {
          this.handleCategories(res);
          this.loaderService.hideLoader();
          resolve(res);
        },
        err => {
          this.loaderService.hideLoader();
          this.snackBarService.open(errorMessages.GET_CATEGORIES_ERROR, "error");
          reject(err);
        }
      );
    });
  }

  getLocationsData() {
    return new Promise((resolve, reject) => {
      this.loaderService.showLoader();
      this.countries = this.locationService.getCountries();
      this.loaderService.hideLoader();
      resolve(true);
    });
  }

  handleCategories(data) {
    if (data.length > 0) {
      data.map(category => {
        let subcategories = [];
        category.subcategories.map(subcategory => {
          subcategories.push({ name: subcategory });
        });
        this.allCategories.push({ name: category.category_name, children: subcategories });
      });
    }
    this.dataSource.data = this.allCategories;
  }

  hasChild = (_: number, node: FlatNode) => node["expandable"];

  selectCategory(node, stepper) {
    this.categoryForm.controls["subCategory"].setValue(node.name);
    this.selectedSubCategory = node.name;
    let category = this.getParentCategory(node.name);
    this.categoryForm.controls["category"].setValue(category);
    this.selectedCategory = category;
    stepper.next();
  }

  getParentCategory(nodeName) {
    for (let i = 0; i < this.allCategories.length; i++) {
      for (let j = 0; j < this.allCategories[i].children.length; j++) {
        if (this.allCategories[i].children[j].name === nodeName) {
          return this.allCategories[i].name;
        }
      }
    }
  }

  addImage() {
    let input = document.createElement("input");
    input.type = "file";
    input.onchange = _ => {
      // you can use this method to get file and perform respective operations
      let files = Array.from(input.files);
      this.readImage(files[0]);
    };
    input.click();
  }

  readImage(file) {
    // Check if the file is an image.
    if (file.type && (!file.type.startsWith("image/") || file.type.startsWith("image/gif"))) {
      this.snackBarService.open(errorMessages.NOT_AN_IMAGE, "error");
      this.loaderService.hideLoader();
      return;
    }

    const reader = new FileReader();
    reader.onload = event => {
      let imageUrl = event.target.result as string;
      if (!this.imageUrls.includes(imageUrl)) {
        this.imageUrls.push(imageUrl);
        this.newImagesAdded.push(imageUrl);
        this.photos.push({ imageUrl: imageUrl, file: file });
      } else {
        this.snackBarService.open(errorMessages.IMAGE_ALREADY_UPLOADED, "error");
      }
    };
    reader.readAsDataURL(file);
  }

  redirectToUserProfile() {
    this.localStorageService.setItem("userProfileSelectedTabIndex", 1);
    this.router.navigateByUrl(`/userProfile/${this.loggedInUser._id}`);
  }

  deleteImage(imageUrl) {
    const newImageIndex = this.newImagesAdded.indexOf(imageUrl);
    if (newImageIndex === -1) {
      this.deletedExistingImages.deletedImages.push(imageUrl);
    }
    const index = this.imageUrls.indexOf(imageUrl);
    if (index > -1) {
      this.imageUrls.splice(index, 1);
    }
    //Also remove image from this.photos
    this.photos = this.photos.filter(photo => {
      return photo.imageUrl !== imageUrl;
    });
  }

  postAd(stepper) {
    this.loaderService.showLoader();
    let formData = new FormData();
    let location = "";
    if (this.detailsForm.get("city").value) {
      location = `${this.detailsForm.get("city").value}, ${this.detailsForm.get("state").value}, ${
        this.detailsForm.get("country").value
      }`;
    } else {
      location = `${this.detailsForm.get("state").value}, ${this.detailsForm.get("country").value}`;
    }
    formData.append("title", this.detailsForm.get("title").value);
    formData.append("description", this.detailsForm.get("description").value);
    formData.append("owner", this.detailsForm.get("owner").value);
    formData.append("price", this.detailsForm.get("price").value);
    formData.append("location", location);
    formData.append("category", this.selectedCategory);
    formData.append("subcategory", this.selectedSubCategory);
    formData.append("seller", this.loggedInUser._id);
    formData.append("active", "true");
    this.photos.map(photo => {
      formData.append("photos", photo.file);
    });
    this.httpService.postRequest(`products/upload`, formData).subscribe(
      res => {
        this.uploadedProductDetail = res[0];
        this.loaderService.hideLoader();
        this.snackBarService.open(successMessages.PRODUCT_ADDED_SUCCESSFULLY, "success");
        stepper.next();
      },
      err => {
        this.loaderService.hideLoader();
        this.snackBarService.open(errorMessages.UPDATE_FAILED_ERROR, "error");
      }
    );
  }

  updateAd(stepper) {
    this.loaderService.showLoader();
    let formData = new FormData();
    let deletedImages = JSON.stringify(this.deletedExistingImages);
    let location = "";
    if (this.detailsForm.get("city").value) {
      location = `${this.detailsForm.get("city").value}, ${this.detailsForm.get("state").value}, ${
        this.detailsForm.get("country").value
      }`;
    } else {
      location = `${this.detailsForm.get("state").value}, ${this.detailsForm.get("country").value}`;
    }
    let changes = {
      title: this.detailsForm.get("title").value,
      description: this.detailsForm.get("description").value,
      owner: this.detailsForm.get("owner").value,
      price: this.detailsForm.get("price").value,
      location: location,
      category: this.selectedCategory,
      subcategory: this.selectedSubCategory
    };
    formData.append("productId", this.existingProductDetails._id);
    formData.append("deletedImages", deletedImages);
    formData.append("changes", JSON.stringify(changes));
    this.photos.map(photo => {
      formData.append("photos", photo.file);
    });
    this.httpService.putRequest(`products/update`, formData).subscribe(
      res => {
        this.updatedProductDetails = res[0];
        this.loaderService.hideLoader();
        this.snackBarService.open(successMessages.PRODUCT_UPDATED_SUCCESSFULLY, "success");
        stepper.next();
      },
      err => {
        this.loaderService.hideLoader();
        this.snackBarService.open(errorMessages.UPDATE_FAILED_ERROR, "error");
      }
    );
  }

  handlePrice(event) {
    if (event.target.value > 0) {
      this.priceInWords = converter(event.target.value);
      this.priceInWords = this.priceInWords[0].toUpperCase().concat(this.priceInWords.slice(1));
    } else {
      this.priceInWords = "";
    }
  }

  postAnotherAd() {
    window.location.reload();
  }

  redirectToProductDetails() {
    this.localStorageService.setItem("favorite", this.product.isUserFavorite);
    if (this.isEditMode) {
      this.router.navigateByUrl(`productDetails/${this.existingProductDetails._id}`);
    } else {
      this.router.navigateByUrl(`productDetails/${this.uploadedProductDetail._id}`);
    }
  }

  redirectToMyAds() {
    this.localStorageService.setItem("userProfileSelectedTabIndex", 2);
    // redirect to MyAds page
    this.router.navigateByUrl(`/userProfile/${this.loggedInUser["_id"]}`);
  }
}
