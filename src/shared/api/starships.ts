import axiosInstance from './axiosInstance';
import type { Starship } from '../types/api';

export const getStarship = async (id: string | number): Promise<Starship> => {
  const response = await axiosInstance.get<Starship>(`/starships/${id}/`);
  return response.data;
};

