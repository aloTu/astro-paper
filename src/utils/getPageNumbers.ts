import { SITE } from "@config";

const getPageNumbers = (
  numberOfPosts: number,
  numPerPage = SITE.postPerPage
) => {
  const numberOfPages = numberOfPosts / numPerPage;

  let pageNumbers: number[] = [];
  for (let i = 1; i <= Math.ceil(numberOfPages); i++) {
    pageNumbers = [...pageNumbers, i];
  }

  return pageNumbers;
};

export default getPageNumbers;
