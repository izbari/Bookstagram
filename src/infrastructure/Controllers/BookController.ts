export const checkThumbnail = item => {
  if (
    typeof item.volumeInfo.imageLinks !== 'undefined' &&
    item.volumeInfo.imageLinks.thumbnail != null
  ) {
    return {uri: item.volumeInfo.imageLinks.thumbnail};
  } else {
    return require('../../resources/assets/images/imagePlaceholder.jpg');
  }
};
export const checkDescription = item => {
  if (
    typeof item.volumeInfo.description !== 'undefined' &&
    item.volumeInfo.description != null
  ) {
    return item.volumeInfo.description.slice(0, 80);
  } else {
    return 'Description is not found!';
  }
};
export const checkAuthor = item => {
  if (
    typeof item.volumeInfo.authors !== 'undefined' &&
    item.volumeInfo.authors != null
  ) {
    return item.volumeInfo.authors['0'];
  } else {
    return 'Author is not found!';
  }
};
export const checkTitle = item => {
  if (
    typeof item.volumeInfo.title !== 'undefined' &&
    item.volumeInfo.title != null
  ) {
    return item.volumeInfo.title.slice(0, 15);
  } else {
    return 'Title is not found!';
  }
};
export const checkPrice = item => {
  if (
    typeof item.saleInfo.listPrice !== 'undefined' &&
    item.saleInfo.listPrice != null
  ) {
    return (
      item.saleInfo.listPrice.amount +
      ' ' +
      item.saleInfo.listPrice.currencyCode
    );
  } else {
    return 'Price undefined';
  }
};
export const genres = {
  12: 'Adventure',
  14: 'Fantasy',
  16: 'Animation',
  18: 'Drama',
  27: 'Horror',
  28: 'Action',
  35: 'Comedy',
  36: 'History',
  37: 'Western',
  53: 'Thriller',
  80: 'Crime',
  99: 'Documentary',
  878: 'Science Fiction',
  9648: 'Mystery',
  10402: 'Music',
  10749: 'Romance',
  10751: 'Family',
  10752: 'War',
  10770: 'TV Movie',
};

const API_URL = `https://www.googleapis.com/books/v1/volumes?q=java&printType=books&maxResults=40&langRestrict=en&orderBy=relevance&key=AIzaSyByxO96LIpEUfdloW3nXPGQbJfarekB7t0`;
export const getImagePath = (path: string) =>
  `https://image.tmdb.org/t/p/w440_and_h660_face${path}`;
export const getBackdropPath = (path: string) =>
  `https://image.tmdb.org/t/p/w370_and_h556_multi_faces${path}`;

export const getMovies = async () => {
  const {items} = await fetch(API_URL).then(x => x.json());
  const movies = items.map(({id, volumeInfo}) => ({
    key: id,
    title: volumeInfo.title,
    desc: volumeInfo.description,
    imageURL: volumeInfo.imageLinks.thumbnail,
    author: volumeInfo.authors,
  }));

  return movies;
};
