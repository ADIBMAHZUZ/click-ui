import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-category-listing-skeleton',
  templateUrl: './category-listing.component.html',
  styleUrls: ['../category-listing/category-listing.component.scss'],
})
export class CategoryListingSkeletonComponent implements OnInit {
  slideConfig = null;

  constructor(private _platform: Platform) {}

  ngOnInit(): void {
    if (this._platform.width() < 768) {
      this.slideConfig = {
        spaceBetween: 0.01,
        slidesPerView: 2.5,
        centeredSlides: false,
      };
    } else {
      this.slideConfig = {
        spaceBetween: 0.01,
        slidesPerView: 6.5,
        centeredSlides: false,
      };
    }
  }
}
