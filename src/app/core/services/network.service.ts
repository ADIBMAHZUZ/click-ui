import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { SendOfflineRequests } from '../store/core.actions';
import { Store } from '@ngxs/store';
import { ElectronService } from 'ngx-electron';
export enum ConnectionStatus {
  Online,
  Offline,
}
@Injectable({ providedIn: 'root' })
export class NetworkService {
  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(ConnectionStatus.Offline);

  constructor(
    private network: Network,
    private toastController: ToastController,
    private plt: Platform,
    private _store: Store,
    private electronService: ElectronService
  ) {
    this.plt.ready().then(() => {
      this.initializeNetworkEvents();
      let status = this.network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
      if (this.electronService.isElectronApp) {
        status = navigator.onLine ? ConnectionStatus.Online : ConnectionStatus.Offline;
      }
      this.status.next(status);
    });
  }

  public initializeNetworkEvents() {
    if (this.electronService.isElectronApp) {
      window.addEventListener('online', () => {
        if (this.status.getValue() === ConnectionStatus.Offline) {
          this.updateNetworkStatus(ConnectionStatus.Online);
        }
      });
      window.addEventListener('offline', () => {
        if (this.status.getValue() === ConnectionStatus.Online) {
          this.updateNetworkStatus(ConnectionStatus.Offline);
        }
      });
      if (navigator.onLine) {
        this.updateNetworkStatus(ConnectionStatus.Online);
      } else {
        this.updateNetworkStatus(ConnectionStatus.Offline);
      }

      // document.getElementById('status').innerHTML = navigator.onLine ? 'online' : 'offline'
    }

    this.network.onDisconnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Online) {
        this.updateNetworkStatus(ConnectionStatus.Offline);
      }
    });

    this.network.onConnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Offline) {
        this.updateNetworkStatus(ConnectionStatus.Online);
        this._store.dispatch(new SendOfflineRequests());
      }
    });
  }

  private async updateNetworkStatus(status: ConnectionStatus) {
    this.status.next(status);

    let connection = status == ConnectionStatus.Offline ? 'Offline' : 'Online';
    let toast = await this.toastController.create({
      message: `You are now ${connection}`,
      duration: 3000,
      position: 'bottom',
    });
    await toast.present();
  }

  public onNetworkChange(): Observable<ConnectionStatus> {
    return this.status.asObservable();
  }

  public getCurrentNetworkStatus(): ConnectionStatus {
    return this.status.getValue();
  }

  isConnected(): boolean {
    return this.getCurrentNetworkStatus() === ConnectionStatus.Online || navigator.onLine;
  }
}
