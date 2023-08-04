import { DownloadMaterialDetailStateModel } from 'src/app/core/models';

export interface MaterialStateModel {
  selectedMaterial: DownloadMaterialDetailStateModel;
}

export const initialState: MaterialStateModel = {
  selectedMaterial: null,
};
