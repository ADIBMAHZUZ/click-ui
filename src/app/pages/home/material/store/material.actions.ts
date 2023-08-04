const enum Actions {
  LOAD_SELECTED_MATERIAL = '[Material] Load Selected Material',
  LOAD_SELECTED_MATERIAL_OFFLINE = '[Material] Load Selected Material Offline',
  DOWNLOAD_ALL_MATERIALS = '[Material] Download All Materials',
}

export class LoadSelectedMaterial {
  static readonly type = Actions.LOAD_SELECTED_MATERIAL;
  constructor(public readonly payload: { id: string }) {}
}
export class LoadSelectedMaterialOffline {
  static readonly type = Actions.LOAD_SELECTED_MATERIAL_OFFLINE;
  constructor(public readonly payload: { id: string }) {}
}
export class DownloadAllMaterials {
  static readonly type: string = Actions.DOWNLOAD_ALL_MATERIALS;
}
