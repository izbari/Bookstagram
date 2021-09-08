import React, { useState, useEffect } from 'react';
import axios from 'axios';


function getTopics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState([]);

  let images = []
  const categories = [
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

  const fetchData = async () => {


    try {
      for (let i = 0; i < categories.length; i++) {
        const data = await axios
          .get(
            `https://pixabay.com/api/?key=23266537-d3b0b63adb5af1ba19302b426&q=
      ${categories[i]}&image_type=photo`,
          )

        images.push({id:i,url:data.data.hits['0'].previewURL,check:false})
        console.log("buna bak:", data.data.hits['0'].previewURL)
      }
    }
    catch (err) {
      setError(true);
      setLoading(false);
      console.log(err);
    };
    console.log("images size:", images.length)
    setData(images)
    setLoading(false);

  }
  useEffect(() => {
    fetchData()
  }, []);

  return { error, loading, data, categories }
};
export default getTopics