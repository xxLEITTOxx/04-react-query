import axios from "axios";
import type { Movie, MoviesResponse } from "../types/movie";

interface httpResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

const apiClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
});

export const fetchMovies = async (
  query: string,
  page: number
): Promise<MoviesResponse> => {
  const response = await apiClient.get<httpResponse>("/search/movie", {
    params: { query, page },
  });
  return {
    movies: response.data.results,
    totalPages: response.data.total_pages,
  };
};
