import { SITE } from "@config";
import getPageNumbers from "./getPageNumbers";

interface GetPaginationProps<T> {
  posts: T;
  page: string | number;
  numPerPage?: number;
}

const getPagination = <T>({
  posts,
  page,
  numPerPage,
}: GetPaginationProps<T[]>) => {
  const totalPagesArray = getPageNumbers(posts.length, numPerPage);
  const totalPages = totalPagesArray.length;

  const currentPage =
    page && !isNaN(Number(page)) && totalPagesArray.includes(Number(page))
      ? Number(page)
      : 0;

  const lastPost = currentPage * SITE.postPerPage;
  const startPost = lastPost - SITE.postPerPage;
  const paginatedPosts = posts.slice(startPost, lastPost);

  return {
    totalPages,
    currentPage,
    paginatedPosts,
  };
};

export default getPagination;
