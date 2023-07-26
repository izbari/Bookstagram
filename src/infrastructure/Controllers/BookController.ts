export const checkThumbnail = imageLinks => {
  if (typeof imageLinks !== 'undefined' && imageLinks.thumbnail != null) {
    return {uri: imageLinks.thumbnail};
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
    item.saleInfo.listPrice != null &&
    item.saleInfo.listPrice.amount !== 0
  ) {
    return (
      item.saleInfo.listPrice.amount +
      ' ' +
      item.saleInfo.listPrice.currencyCode
    );
  } else {
    return '';
  }
};

const API_URL = `https://www.googleapis.com/books/v1/volumes?q=python&printType=books&maxResults=40&langRestrict=en&orderBy=relevance&key=AIzaSyByxO96LIpEUfdloW3nXPGQbJfarekB7t0`;

export const getBooks = async () => {
  const {items} = await fetch(API_URL).then(x => x.json());
  const books = items.map(({id, volumeInfo, ...rest}) => ({
    ...volumeInfo,
    ...rest,
    id: id,
    title: volumeInfo.title,
    desc: volumeInfo.description,
    imageURL: volumeInfo.imageLinks.thumbnail,
    author: volumeInfo.authors,
  }));

  return books;
};
