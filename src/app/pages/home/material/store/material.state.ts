import { Injectable } from '@angular/core';
import {
  State,
  Store,
  Selector,
  createSelector,
  StateContext,
  Action,
} from '@ngxs/store';
import * as GlobalDownloadActions from 'src/app/shared/download/store/download.actions';
import { MaterialStateModel, initialState } from './material-state.model';
import { MaterialService } from '../material.service';
import { DownloadState } from 'src/app/shared/download/store/download.state';
import { DownloadStateModel } from 'src/app/shared/download/store/download-state.model';
import {
  LoadSelectedMaterial,
  DownloadAllMaterials,
  LoadSelectedMaterialOffline,
} from './material.actions';
import { tap, take, mapTo, switchMap } from 'rxjs/operators';
import { DownloadType } from 'src/app/shared/download/models/download-type.model';
import { MediaType } from 'src/app/core/models';
import { of } from 'rxjs';
import { NetworkService } from '@core-services';
import { getId } from 'src/app/shared/download';

@Injectable({ providedIn: 'root' })
@State<MaterialStateModel>({
  name: 'material',
  defaults: initialState,
})
export class MaterialState {
  constructor(
    private _apiService: MaterialService,
    private _store: Store,
    private _network: NetworkService
  ) {}

  @Selector()
  static getSelectedMaterial(state: MaterialStateModel) {
    return state.selectedMaterial;
  }

  static getDownloadedMaterialById({ id }) {
    const generatedId = getId(DownloadType.LEARNING_MATERIAL, id);
    return createSelector(
      [DownloadState],
      (state: DownloadStateModel) =>
        state.downloaded.learningMaterials[generatedId]
    );
  }

  static getDownloadedMaterialsByType(payload: {
    mediaType: MediaType;
    categoryId?: string;
    query: string;
  }) {
    return createSelector([DownloadState], (state: DownloadStateModel) => {
      const materialsAsArray = Object.values(
        state.downloaded.learningMaterials
      );

      return materialsAsArray.filter((material) => {
        const isSuitableMediaType =
          material.item?.mediaType === payload.mediaType;
        const isSuitableCategoryId = payload.categoryId
          ? material.item?.category.id == payload.categoryId
          : true;
        const isSuitableQuery = payload.query
          ? material.item?.name
              .toLowerCase()
              .includes(payload.query.toLowerCase())
          : true;
        return isSuitableMediaType && isSuitableCategoryId && isSuitableQuery;
      });
    });
  }

  @Action(LoadSelectedMaterial)
  loadSelectedMaterial(
    { patchState, dispatch }: StateContext<MaterialStateModel>,
    { payload }: LoadSelectedMaterial
  ) {
    const { id } = payload;
    return this._apiService.getMaterialById(id).pipe(
      switchMap((state) => {
        const downloadedMaterial = this._store.selectSnapshot(
          MaterialState.getDownloadedMaterialById({ id })
        );

        if (downloadedMaterial) {
          return dispatch(
            new GlobalDownloadActions.UpdateItem({
              downloadType: DownloadType.LEARNING_MATERIAL,
              id: id,
              item: state?.item,
            })
          ).pipe(
            mapTo(
              this._store.selectSnapshot(
                MaterialState.getDownloadedMaterialById({ id: payload.id })
              )
            )
          );
        }
        return of(state);
      }),
      tap((state) => {
        patchState({
          selectedMaterial: state,
        });
      })
    );
  }

  @Action(LoadSelectedMaterialOffline)
  loadSelectedMaterialOffline(
    { patchState, dispatch }: StateContext<MaterialStateModel>,
    { payload }: LoadSelectedMaterialOffline
  ) {
    const { id } = payload;
    if (this._network.isConnected()) {
      return this._apiService.getMaterialById(id).pipe(
        switchMap((newestState) => {
          const downloadedMaterial = this._store.selectSnapshot(
            MaterialState.getDownloadedMaterialById({ id })
          );

          if (downloadedMaterial) {
            return dispatch(
              new GlobalDownloadActions.UpdateItem({
                downloadType: DownloadType.LEARNING_MATERIAL,
                id: id,
                item: newestState?.item,
              })
            ).pipe(
              mapTo(
                this._store.selectSnapshot(
                  MaterialState.getDownloadedMaterialById({ id: payload.id })
                )
              )
            );
          }
        }),
        tap((downloadedState) => {
          patchState({
            selectedMaterial: downloadedState,
          });
        })
      );
    }
    const state = this._store.selectSnapshot(
      MaterialState.getDownloadedMaterialById({ id: payload.id })
    );
    patchState({
      selectedMaterial: state,
    });
  }

  @Action(DownloadAllMaterials)
  downloadAllMaterials(context: StateContext<MaterialStateModel>) {
    return this._apiService.getDownloadedMaterials().pipe(
      take(1),
      tap((response) => {
        for (const material of response.results) {
          if (material) {
            context.dispatch(
              new GlobalDownloadActions.PrepareToDownload({
                item: material,
                downloadType: DownloadType.LEARNING_MATERIAL,
              })
            );
          }
        }
      })
    );
  }
}
