import React, {useState, useEffect} from 'react';
import axios from 'axios';

function getTopics(check) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);

  let images = [];
  let i = 0;

  let categories = [
    'Fantasy',
    'Adventure',
    'Diary',
    'Crime',
    'Mystery',
    'Horror',
    'Thriller',
    'Paranormal',
    'Historical fiction',
    'Science Fiction',
    'Memoir',
    'Cooking',
    'Art',
    'Poetry',
    'Development',
    'Motivational',
    'Health',
    'History',
    'Travel',
    'Drama',
    'Families & Relationships',
    'Humor',
    'Children',
    'Business',
  ];
  if (check) {
    i = 1;
    categories.unshift('Add');
    images.push({
      id: -1,
      url: 'https://firebasestorage.googleapis.com/v0/b/bookstagram-325020.appspot.com/o/plus-svgrepo-com.svg?alt=media&token=104c07dd-ef75-4900-add0-b7b1ffd47790',
    });
  }

  const fetchData = async () => {
    try {
      for (; i < categories.length; i++) {
        const data = await axios.get(
          `https://pixabay.com/api/?key=23266537-d3b0b63adb5af1ba19302b426&q=
    ${categories[i]}&image_type=photo`,
        );

        images.push({id: i, url: data.data.hits['0'].previewURL});
      }
    } catch (err) {
      setError(true);
      setLoading(false);
      console.log(err);
    }
    setData(images);
    setLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return {error, loading, data, categories};
}
export default getTopics;
