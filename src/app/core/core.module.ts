import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CorePageRoutingModule } from './core-routing.module';
import { SharedComponentsModule } from '../shared/shared.module';
import { CorePage } from './core.page';
import { MusicFabComponent, NavbarComponent, ProfileComponent, SidebarComponent } from './components';
import { FooterComponent } from './components/footer/footer.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, CorePageRoutingModule, SharedComponentsModule],
  declarations: [CorePage, MusicFabComponent, NavbarComponent, ProfileComponent, SidebarComponent, FooterComponent],
})
export class CorePageModule {}
