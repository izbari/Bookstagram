import React from 'react';
import {Image} from 'react-native';

export function useImageAspectRatio(imageUrl: string) {
  const [aspectRatio, setAspectRatio] = React.useState(1);

  React.useEffect(() => {
    if (!imageUrl) {
      return;
    }

    let isValid = true;
    Image.getSize(imageUrl, (width, height) => {
      if (isValid) {
        setAspectRatio(width / height);
      }
    });

    return () => {
      isValid = false;
    };
  }, [imageUrl]);

  return aspectRatio;
}
