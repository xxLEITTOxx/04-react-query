import SearchBar from "../SearchBar/SearchBar";
import type { Movie } from "../../types/movie.ts";
import {
  fetchMovies,
  type MoviesResponse,
} from "../../services/movieService.ts";
import MovieGrid from "../MovieGrid/MovieGrid.tsx";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader.tsx";
import MovieModal from "../MovieModal/MovieModal.tsx";
import toast, { Toaster } from "react-hot-toast";
import ErrorMessage from "../ErrorMessage/ErrorMessage.tsx";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";

export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  const { data, isLoading, isError, isFetching, isSuccess } =
    useQuery<MoviesResponse>({
      queryKey: ["movies", query, page],
      queryFn: () => fetchMovies(query, page),
      enabled: query.length > 0,
      placeholderData: keepPreviousData,
    });

  useEffect(() => {
    if (isError) {
      toast.error("There was an error, please try again...");
    }
    if (data && data.movies.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isError, data]);

  const handleSearch = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  const handleSelectedMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = (): void => {
    setSelectedMovie(null);
  };

  return (
    <>
      <Toaster position="top-center" />
      <SearchBar onSubmit={handleSearch} />
      {isLoading && isFetching ? (
        <Loader />
      ) : data ? (
        <>
          <MovieGrid movies={data.movies} onSelect={handleSelectedMovie} />
          {isSuccess && data.totalPages > 1 && (
            <ReactPaginate
              pageCount={data.totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      ) : null}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
      {isError && !isFetching && <ErrorMessage />}
    </>
  );
}
