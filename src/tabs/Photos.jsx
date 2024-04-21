import { getPhotos } from 'apiService/photos';
import { Button, Form, PhotosGallery, Text } from 'components';
import { useEffect, useState } from 'react';
import { Loader } from 'components';

export const Photos = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!query) return
    const fetchData = async () => {
      setIsloading(true);
      try {
        const { photos, total_results, per_page } = await getPhotos(query, page);
        if (photos.length === 0) {
          setIsEmpty(true);
          return;
        }
        setImages((prevImages) => [...prevImages, ...photos]);
        setIsVisible(page < Math.ceil(total_results / per_page))
      } catch (error) {
        setError(error);
      } finally {
        setIsloading(false);
      }
    }
    fetchData()
  }, [page, query])

  const onHandleSubmit = (value) => {
    setQuery(value);
    setPage(1);
    setImages([]);
    setIsEmpty(false);
    setError(null);
  }

  const handleClick = () => {
    setPage((prevPage) => prevPage + 1)
  }

  return (
    <>

      <Form onSubmit={onHandleSubmit} />
      {images.length > 0 && <PhotosGallery images={images} />}
      {isVisible && <Button onClick={handleClick} disabled={isloading}>{isloading ? 'loading' : 'loadmore'}</Button>}
      {!images.length && !isEmpty && <Text textAlign="center">Let`s begin search 🔎</Text>}
      {isloading && <Loader />}
      {error && <Text textAlign="center">❌ Something went wrong - {error}</Text>}
      {isEmpty && <Text textAlign="center">Sorry. There are no images ... 😭</Text>}

    </>
  );
};
