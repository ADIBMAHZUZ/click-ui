import { Injectable } from '@angular/core';
import {
  MediaType,
  MaterialCategoriesViewModel,
  MaterialCategoriesResponse,
  MaterialByCategoryViewModel,
  MaterialByCategoryResponse,
  MaterialDetailResponse,
  Successable,
  DownloadedMaterialViewModel,
  DownloadedMaterialResponse,
  DownloadMaterialDetailStateModel,
} from 'src/app/core/models';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ModelConverterService } from 'src/app/core/services/model-converter.service';
import { LEARNING_MATERIAL_ENDPOINTS } from 'src/app/shared/utils/endpoints.api';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MaterialService {
  constructor(
    private httpClient: HttpClient,
    private converter: ModelConverterService
  ) {}

  getMaterialByMediaType(
    mediaType: MediaType,
    query?: string
  ): Observable<MaterialCategoriesViewModel> {
    return this.httpClient
      .get<MaterialCategoriesResponse>(
        LEARNING_MATERIAL_ENDPOINTS.learningMaterialCategories,
        {
          params: { media_type: mediaType, name: query },
        }
      )
      .pipe(
        map((response) =>
          this.converter.fromMaterialCategoriesResponse__MaterialCategoriesViewModel(
            response
          )
        )
      );
  }

  getMaterialByCategoryId(
    id: string,
    mediaType: MediaType,
    query?: string
  ): Observable<MaterialByCategoryViewModel> {
    return this.httpClient
      .get<MaterialByCategoryResponse>(
        `${LEARNING_MATERIAL_ENDPOINTS.learningMaterialCategory}${id}/`,

        {
          params: { media_type: mediaType, name: query },
        }
      )
      .pipe(
        map((response) =>
          this.converter.fromMaterialByCategoryResponse_MaterialByCategoryViewModel(
            response
          )
        )
      );
  }

  getMaterialById(id: string): Observable<DownloadMaterialDetailStateModel> {
    return this.httpClient
      .get<MaterialDetailResponse>(
        `${LEARNING_MATERIAL_ENDPOINTS.learningMaterialCategories}${id}/`
      )
      .pipe(
        map((response: MaterialDetailResponse) => {
          if (response.results) {
            return this.converter.fromMaterialDetailResponse__DownloadMaterialDetailStateModel(
              response
            );
          }
          return null;
        })
      );
  }

  public downloadBookById(id: string): Observable<Successable> {
    return this.httpClient.post<Successable>(
      `${LEARNING_MATERIAL_ENDPOINTS.learningMaterial}${id}/download/`,
      {}
    );
  }

  public deleteBookById(id: string): Observable<Successable> {
    return this.httpClient.post<Successable>(
      `${LEARNING_MATERIAL_ENDPOINTS.learningMaterial}${id}/return/`,
      {}
    );
  }

  public getDownloadedMaterials(): Observable<DownloadedMaterialViewModel> {
    return this.httpClient
      .get<DownloadedMaterialResponse>(
        LEARNING_MATERIAL_ENDPOINTS.learningMaterialDownloaded
      )
      .pipe(
        map((response: DownloadedMaterialResponse) =>
          this.converter.fromDownloadedMaterialResponse__DownloadedMaterialViewModel(
            response
          )
        )
      );
  }

  public getMaterialByCategoryIdMore(
    next
  ): Observable<MaterialByCategoryViewModel> {
    return this.httpClient
      .get<MaterialByCategoryResponse>(next)
      .pipe(
        map((response) =>
          this.converter.fromMaterialByCategoryResponse_MaterialByCategoryViewModel(
            response
          )
        )
      );
  }
}
