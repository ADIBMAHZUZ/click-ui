import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { MediaType } from 'src/app/core/models';

export interface ListingItem {
  id: string;
  name: string;
  thumbnail: string;
  mediaType?: MediaType;
}

@Component({
  selector: 'app-category-listing',
  templateUrl: './category-listing.component.html',
  styleUrls: ['./category-listing.component.scss'],
})
export class CategoryListingComponent implements OnInit {
  @Input() title: string;
  @Input() items: Array<ListingItem>;
  @Input() enableSeeAll = true;
  @Output() clickTitle: EventEmitter<void> = new EventEmitter<void>();
  @Output() clickItem: EventEmitter<string> = new EventEmitter<string>();
  @Output() clickToNavigateWithMediaType: EventEmitter<{
    id: string;
    mediaType: MediaType;
  }> = new EventEmitter();

  slideConfig = null;

  constructor(private _platform: Platform) {}

  ngOnInit(): void {
    if (this._platform.width() < 768) {
      this.slideConfig = {
        spaceBetween: 0.01,
        slidesPerView: 3,
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

  emitItem(item: ListingItem) {
    const { id, mediaType } = item;
    this.clickItem.emit(id);
    if (mediaType) {
      this.clickToNavigateWithMediaType.emit({
        id,
        mediaType,
      });
    }
  }
}
