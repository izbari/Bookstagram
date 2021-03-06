

exports.checkThumbnail = (item) => {

    if (typeof (item.volumeInfo.imageLinks) !== 'undefined' &&
        item.volumeInfo.imageLinks.thumbnail != null) {
        return {uri:item.volumeInfo.imageLinks.thumbnail}
    }

    else {
        return require('../assets/png/imagePlaceholder.jpg')
        }
}
exports.checkDescription = (item) => {

    if (typeof (item.volumeInfo.description) !== 'undefined' &&
        item.volumeInfo.description != null) {
        return item.volumeInfo.description.slice(0, 80)
    }

    else {
        return "Description is not found!"
    }
}
exports.checkAuthor = (item) => {
    if (typeof (item.volumeInfo.authors) !== 'undefined' &&
        item.volumeInfo.authors != null) {
        return item.volumeInfo.authors["0"]
    }
    else {
        return "Author is not found!"
    }
}
exports.checkTitle = (item) => {
    if (typeof (item.volumeInfo.title) !== 'undefined'
        && item.volumeInfo.title != null) {
        return item.volumeInfo.title.slice(0, 15)
    }

    else {
        return "Title is not found!"
    }
}
exports.checkPrice = (item) => {

    if (typeof (item.saleInfo.listPrice) !== 'undefined' &&
        item.saleInfo.listPrice != null) {
        return item.saleInfo.listPrice.amount+" "+item.saleInfo.listPrice.currencyCode;
    }

    else {
        return "Price undefined"
    }
}
