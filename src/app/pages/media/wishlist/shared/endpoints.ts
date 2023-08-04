import { environment } from 'src/environments/environment';

const { API_URL } = environment;

const favorites = `${API_URL}media/favorite/`;
const featureFavorite = `${API_URL}media/:id/favorite/`;
export const MEDIA_ENDPOINTS = {
  favorites,
  featureFavorite,
};
