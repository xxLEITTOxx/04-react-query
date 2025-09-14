import axios from "axios";
import type { Movie } from "../types/movie";

interface TMDBResponse {
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

export interface MoviesResponse {
  movies: Movie[];
  totalPages: number;
}

export const fetchMovies = async (
  query: string,
  page: number
): Promise<MoviesResponse> => {
  const { data } = await apiClient.get<TMDBResponse>("/search/movie", {
    params: { query, page },
  });
  return {
    movies: data.results,
    totalPages: data.total_pages,
  };
};
