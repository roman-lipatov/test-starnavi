import axiosInstance from './axiosInstance';
import type { Film } from '../types/api';

export const getFilm = async (id: string | number): Promise<Film> => {
  const response = await axiosInstance.get<Film>(`/films/${id}/`);
  return response.data;
};

