export default function (data) {
  return Object.keys(data)
    .map(key => {
      return {
        path: key,
        ...data[key],
      };
    })
    .sort(function (a, b) {
      return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
    });
}
