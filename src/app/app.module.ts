import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { NgxsModule } from '@ngxs/store';
// import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsResetPluginModule } from 'ngxs-reset-plugin';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { SharedComponentsModule } from './shared/shared.module';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';

import { TokenInterceptor } from './core/interceptors/token.interceptor';
import { appState, appStoredState } from './store/app-state.model';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Market } from '@ionic-native/market/ngx';
import { BatteryStatus } from '@ionic-native/battery-status/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { NavigationBar } from '@ionic-native/navigation-bar/ngx';
import { Network } from '@ionic-native/network/ngx';
import { BatteryService } from './core/services/battery-service.service';
import { environment } from 'src/environments/environment';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NgxElectronModule } from 'ngx-electron';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'md',
      scrollAssist: false,
      scrollPadding: false,
      animated: false,
    }),
    AppRoutingModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    SharedComponentsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgxsModule.forRoot(appState, { developmentMode: !environment.production }),
    NgxsStoragePluginModule.forRoot({
      key: appStoredState,
    }),
    // NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    NgxsResetPluginModule.forRoot(),
    NgxElectronModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    NativeStorage,
    File,
    FileOpener,
    Market,
    FileTransfer,
    Network,
    TranslateService,
    BatteryStatus,
    BatteryService,
    ScreenOrientation,
    NavigationBar,
    Network,
    StatusBar,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
