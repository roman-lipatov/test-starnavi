import axiosInstance from './axiosInstance';
import type { Person, ApiResponse } from '../types/api';

export const getPeople = async (page: number = 1): Promise<ApiResponse<Person>> => {
  const response = await axiosInstance.get<ApiResponse<Person>>(`/people/?page=${page}`);
  return response.data;
};

export const getPerson = async (id: string | number): Promise<Person> => {
  const response = await axiosInstance.get<Person>(`/people/${id}/`);
  return response.data;
};

