import { State, Selector, Action, StateContext, Store } from '@ngxs/store';
import { initialState, DownloadStateModel } from './download-state.model';
import { Injectable, NgZone } from '@angular/core';
import {
  Downloading,
  Downloaded,
  UpdateItem,
  AddItem,
  RemoveItem,
  DownloadItem,
  PrepareToDownload,
  CreateFolders,
  UpdateItems,
  AddItems,
  RemoveItems,
} from './download.actions';
import { initialDownloadDetailState, initialPrepareDetailState } from '../models/download-detail-state.model';
import { Platform, AlertController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/file/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { getDownloadableExtension, getId } from '../utils';
import { filter, switchMap, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AddBookmark, RemoveBookmark } from './bookmark.actions';
import { DirectoryNames, DownloadType } from '../models';
import { TranslateService } from '@ngx-translate/core';
import { DownloadElectronService } from 'src/app/core/services/download-electron.service';
import { ElectronService } from 'ngx-electron';
import { DownloadingInfo } from 'src/app/core/models/others/electron.model';
import { Plugins } from '@capacitor/core';
import { Downloading as MediaDownloading, Downloaded as MediaDownloaded } from 'src/app/pages/home/library/store/library.actions';
import { LibraryState } from 'src/app/pages/home/library/store';

const { Filesystem } = Plugins;
@State<DownloadStateModel>({ name: 'download', defaults: initialState })
@Injectable({ providedIn: 'root' })
export class DownloadState {
  constructor(
    private _platform: Platform,
    private _file: File,
    private _store: Store,
    private _ngZone: NgZone,
    private _fileTransfer: FileTransfer,
    private _alertCtrl: AlertController,
    private _translate: TranslateService,
    private _electron: ElectronService,
    private _downloadElectron: DownloadElectronService
  ) {}

  @Selector()
  static getDownloaded(state: DownloadStateModel) {
    return state.downloaded;
  }

  @Selector()
  static getDownloadedMedias(state: DownloadStateModel) {
    return state.downloaded.medias;
  }

  @Selector()
  static getDownloadedMaterials(state: DownloadStateModel) {
    return state.downloaded.learningMaterials;
  }

  @Selector()
  static getDownloadedNotes(state: DownloadStateModel) {
    return state.downloaded.teacherNotes;
  }

  @Action(Downloading)
  downloading({ getState, patchState, dispatch }: StateContext<DownloadStateModel>, { payload }: Downloading) {
    const generatedId = getId(payload.downloadType, payload.id);
    const downloaded = getState().downloaded;
    const downloadTypeOfDownloaded = getState().downloaded[payload.downloadType];

    if (downloadTypeOfDownloaded[generatedId] && !downloadTypeOfDownloaded[generatedId].downloaded) {
      if (payload.downloadType === DownloadType.MEDIA) {
        const selectedMedia = this._store.selectSnapshot(LibraryState.getSelectedMedia);
        if (selectedMedia?.item.id === payload.id) {
          dispatch(
            new MediaDownloading({
              downloadedSize: payload.downloadedSize,
              totalSize: payload.totalSize,
              transferStream: payload.transferStream,
            })
          );
        }
      }
      patchState({
        downloaded: {
          ...downloaded,
          [payload.downloadType]: {
            ...downloadTypeOfDownloaded,
            [generatedId]: {
              ...downloadTypeOfDownloaded[generatedId],
              downloading: {
                downloadedSize: payload.downloadedSize,
                totalSize: payload.totalSize,
                transferStream: payload.transferStream,
              },
            },
          },
        },
      });
    }
  }

  @Action(Downloaded)
  downloaded({ getState, patchState, dispatch }: StateContext<DownloadStateModel>, { payload }: Downloaded) {
    const generatedId = getId(payload.downloadType, payload.id);
    const downloaded = getState().downloaded;
    const downloadTypeOfDownloaded = getState().downloaded[payload.downloadType];
    if (payload.downloadType === DownloadType.MEDIA) {
      dispatch(new MediaDownloaded({ id: payload.id, path: { directory: payload.directory, name: payload.name } }));
    }
    patchState({
      downloaded: {
        ...downloaded,
        [payload.downloadType]: {
          ...downloadTypeOfDownloaded,
          [generatedId]: {
            ...downloadTypeOfDownloaded[generatedId],
            path: { directory: payload.directory, name: payload.name },
            downloading: undefined,
            downloaded: true,
          },
        },
      },
    });
  }

  @Action(PrepareToDownload)
  prepareToDownload({ getState, patchState }: StateContext<DownloadStateModel>, { payload }: PrepareToDownload) {
    const generatedId = getId(payload.downloadType, payload.item.id);

    if (!generatedId) {
      throw new Error(`Payload type ${payload.downloadType} id not found.`);
    }

    const downloaded = getState().downloaded;
    const downloadTypeOfDownloaded = getState().downloaded[payload.downloadType];
    patchState({
      downloaded: {
        ...downloaded,
        [payload.downloadType]: {
          ...downloadTypeOfDownloaded,
          [generatedId]: {
            ...initialPrepareDetailState,
            id: generatedId,
            item: payload.item,
          },
        },
      },
    });
  }

  @Action(UpdateItem)
  updateItem({ getState, patchState }: StateContext<DownloadStateModel>, { payload }: UpdateItem) {
    const generatedId = getId(payload.downloadType, payload.id);
    const downloaded = getState().downloaded;
    const downloadTypeOfDownloaded = getState().downloaded[payload.downloadType];
    patchState({
      downloaded: {
        ...downloaded,
        [payload.downloadType]: {
          ...downloadTypeOfDownloaded,
          [generatedId]: {
            ...downloadTypeOfDownloaded[generatedId],
            item: payload.item,
          },
        },
      },
    });
  }

  @Action(UpdateItems)
  updateItems({ getState, patchState }: StateContext<DownloadStateModel>, { payload }: UpdateItems) {
    if (payload.length <= 0) {
      return;
    }
    let newState = null;
    for (const item of payload) {
      const generatedId = getId(item.downloadType, item.id);
      const downloaded = getState().downloaded;
      const downloadTypeOfDownloaded = getState().downloaded[item.downloadType];
      newState = {
        downloaded: {
          ...downloaded,
          [item.downloadType]: {
            ...downloadTypeOfDownloaded,
            [generatedId]: {
              ...downloadTypeOfDownloaded[generatedId],
              item: item.item,
            },
          },
        },
      };
    }
    patchState(newState);
  }

  @Action(AddItem)
  addItem({ getState, patchState }: StateContext<DownloadStateModel>, { payload }: AddItem) {
    const generatedId = getId(payload.downloadType, payload.item.id);
    if (!generatedId) {
      throw new Error(`Payload type ${payload.downloadType} id not found.`);
    }

    const downloaded = getState().downloaded;
    const downloadTypeOfDownloaded = getState().downloaded[payload.downloadType];
    patchState({
      downloaded: {
        ...downloaded,
        [payload.downloadType]: {
          ...downloadTypeOfDownloaded,
          [generatedId]: {
            ...initialDownloadDetailState,
            id: generatedId,
            item: payload.item,
          },
        },
      },
    });
  }

  @Action(AddItems)
  addItems({ getState, patchState }: StateContext<DownloadStateModel>, { payload }: AddItems) {
    if (payload.length <= 0) {
      return;
    }
    let newState = null;
    for (const item of payload) {
      const generatedId = getId(item.downloadType, item.item.id);
      if (!generatedId) {
        throw new Error(`item type ${item.downloadType} id not found.`);
      }

      const downloaded = getState().downloaded;
      const downloadTypeOfDownloaded = getState().downloaded[item.downloadType];
      newState = {
        downloaded: {
          ...downloaded,
          [item.downloadType]: {
            ...downloadTypeOfDownloaded,
            [generatedId]: {
              ...initialDownloadDetailState,
              id: generatedId,
              item: item.item,
            },
          },
        },
      };
    }
    patchState(newState);
  }

  @Action(RemoveItem)
  async removeItem({ getState, patchState }: StateContext<DownloadStateModel>, { payload }: RemoveItem) {
    const { downloadType, id } = payload;
    const generatedId = getId(downloadType, id);
    const downloaded = getState().downloaded;
    const downloadTypeOfDownloaded = getState().downloaded[downloadType];
    const removedItem = downloadTypeOfDownloaded[generatedId];
    if (removedItem.downloaded) {
      try {
        const { directory, name } = removedItem.path;
        if (this._electron.isElectronApp) {
          await this._electron.shell.trashItem(`file://${directory}${name}`);
        } else {
          await Filesystem.deleteFile({
            path: `${directory}${name}`,
          });
        }
      } catch (error) {
        console.warn(error);
      }
    }
    const afterDelete = Object.keys(downloadTypeOfDownloaded).reduce((object, key) => {
      if (key != generatedId) {
        object[key] = downloadTypeOfDownloaded[key];
      }
      return object;
    }, {});

    patchState({
      downloaded: {
        ...downloaded,
        [downloadType]: afterDelete,
      },
    });
  }

  @Action(RemoveItems)
  async removeItems({ getState, patchState }: StateContext<DownloadStateModel>, { payload }: RemoveItems) {
    if (payload.length <= 0) {
      return;
    }
    let newState = null;
    for (const item of payload) {
      const { downloadType, id } = item;
      const generatedId = getId(downloadType, id);
      const downloaded = getState().downloaded;
      const downloadTypeOfDownloaded = getState().downloaded[downloadType];
      const removedItem = downloadTypeOfDownloaded[generatedId];
      if (removedItem.downloaded) {
        try {
          const { directory, name } = removedItem.path;
          if (this._electron.isElectronApp) {
            await this._electron.shell.trashItem(`file://${directory}${name}`);
          } else {
            await Filesystem.deleteFile({
              path: `${directory}${name}`,
            });
          }
        } catch (error) {
          console.warn(error);
        }
      }
      const afterDelete = Object.keys(downloadTypeOfDownloaded).reduce((object, key) => {
        if (key != generatedId) {
          object[key] = downloadTypeOfDownloaded[key];
        }
        return object;
      }, {});

      newState = {
        downloaded: {
          ...downloaded,
          [downloadType]: afterDelete,
        },
      };
    }
    patchState(newState);
  }

  @Action(DownloadItem)
  downloadItem(context: StateContext<DownloadStateModel>, { payload }: DownloadItem) {
    const { downloadType, item, onProgress, onComplete } = payload;
    const extension = getDownloadableExtension(downloadType, item);
    const { id, url } = item;

    const dirPath = this._getDownloadFolder(downloadType);
    const fileName = `${id}.${extension}`;
    return context.dispatch(new AddItem({ item: payload.item, downloadType })).pipe(
      switchMap(async () => {
        try {
          if (this._electron.isElectronApp) {
            let index0 = 0;
            return this._downloadElectron.download(
              { url: encodeURI(url), downloadOptions: { filename: fileName, directory: dirPath }, clcOptions: { id } },
              (info: DownloadingInfo) => {
                this._ngZone.run(() => {
                  const { downloadedSize, totalSize } = info;
                  if (downloadedSize > (totalSize / 100) * index0) {
                    context.dispatch(new Downloading({ id: info.clcOptions.id, downloadedSize, totalSize, downloadType }));
                    if (onProgress) {
                      onProgress();
                    }
                    index0 += 2;
                  }
                });
              }
            );
          }

          const transfer = this._fileTransfer.create();
          let index = 0;
          transfer.onProgress((event) => {
            this._ngZone.run(() => {
              const { total, loaded } = event;

              if (loaded > (total / 100) * index) {
                context.dispatch(new Downloading({ id, totalSize: total, downloadedSize: loaded, transferStream: transfer, downloadType }));
                if (onProgress) {
                  onProgress();
                }
                index += 2;
              }
            });
          });

          return transfer.download(encodeURI(item.url), dirPath + fileName);
        } catch (err) {
          console.warn(err);
          const { DOWNLOADED_FAILED } = await this._translate.get('TEACHER_NOTES.DETAIL.ALERTS').toPromise();
          const dangerAlert = await this._alertCtrl.create({
            header: DOWNLOADED_FAILED.title,
            message: DOWNLOADED_FAILED.title,
            cssClass: 'danger-alert',
          });
          await dangerAlert.present();
          return null;
        }
      }),
      switchMap((fileItem: FileEntry) => {
        if (!fileItem) {
          return throwError('File Download Failed');
        }
        return context.dispatch(new Downloaded({ id, directory: dirPath, name: fileName, downloadType, mediaName: item.name })).pipe(
          filter(() => !!onComplete),
          tap(() => onComplete())
        );
      })
    );
  }

  @Action(AddBookmark)
  addBookmark({ getState, patchState }: StateContext<DownloadStateModel>, { payload }: AddBookmark) {
    const generatedId = getId(payload.downloadType, payload.id);
    const downloaded = getState().downloaded;
    const downloadTypeOfDownloaded = getState().downloaded[payload.downloadType];
    const downloadedItem = downloadTypeOfDownloaded[generatedId];
    if (downloadedItem.bookmarks.includes(payload.pageIndex)) {
      return;
    }
    const afterAddBookmark = {
      ...downloadedItem,
      bookmarks: [...downloadedItem.bookmarks, payload.pageIndex],
    };
    patchState({
      downloaded: {
        ...downloaded,
        [payload.downloadType]: {
          ...downloadTypeOfDownloaded,
          [generatedId]: afterAddBookmark,
        },
      },
    });
  }
  @Action(RemoveBookmark)
  removeBookmark({ getState, patchState }: StateContext<DownloadStateModel>, { payload }: RemoveBookmark) {
    const generatedId = getId(payload.downloadType, payload.id);
    const downloaded = getState().downloaded;
    const downloadTypeOfDownloaded = getState().downloaded[payload.downloadType];
    const downloadedItem = downloadTypeOfDownloaded[generatedId];
    if (!downloadedItem.bookmarks.includes(payload.pageIndex)) {
      return;
    }
    const newBookmarks = downloadedItem.bookmarks.filter((pageIndex) => pageIndex !== payload.pageIndex);
    const afterRemoveBookmark = {
      ...downloadedItem,
      bookmarks: newBookmarks,
    };
    patchState({
      downloaded: {
        ...downloaded,
        [payload.downloadType]: {
          ...downloadTypeOfDownloaded,
          [generatedId]: afterRemoveBookmark,
        },
      },
    });
  }

  @Action(CreateFolders)
  async createFolders() {
    const rootDir = this._platform.is('ios') ? this._file.documentsDirectory : this._file.dataDirectory;
    try {
      await this._file.createDir(rootDir, DirectoryNames.MEDIAS, true);
      await this._file.createDir(rootDir, DirectoryNames.MATERIALS, true);
      await this._file.createDir(rootDir, DirectoryNames.TEACHER_NOTES, true);
      await this._file.createDir(rootDir, DirectoryNames.TEMPS, true);
    } catch (err) {
      console.warn(err);
    }
  }

  private _getDownloadFolder(downloadType: DownloadType) {
    let rootDir = this._platform.is('ios') ? this._file.documentsDirectory : this._file.dataDirectory;
    if (this._electron.isElectronApp) {
      rootDir = __dirname + '/';
    }
    let subDir = '';
    switch (downloadType) {
      case DownloadType.MEDIA:
        subDir = DirectoryNames.MEDIAS;
        break;
      case DownloadType.LEARNING_MATERIAL:
        subDir = DirectoryNames.MATERIALS;
        break;
      case DownloadType.TEACHER_NOTE:
        subDir = DirectoryNames.TEACHER_NOTES;
        break;
    }
    return `${rootDir}${subDir}/`;
  }
}
