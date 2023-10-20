import axios from 'axios';
export {fetchPhotoByKeyword}

const APIKEY = '39658126-cca0e2f1e761c4f8cef133a9f';
const url = 'https://pixabay.com/api/';
const maxPhotos = 40;
let pageNum = 0;

async function fetchPhotoByKeyword(keyword) {
  const { data } = await axios.get('', {
    baseURL: url,
    params: {
      key: APIKEY,
      q: keyword,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: maxPhotos,
      page: pageNum,
    },
  });

  return data;
}


