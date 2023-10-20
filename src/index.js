import { fetchPhotoByKeyword } from './fetch-photo-keyword';

// import axios from 'axios';
import Notiflix, { Loading } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const input = document.querySelector('.input');

// const APIKEY = '39658126-cca0e2f1e761c4f8cef133a9f';
// const url = 'https://pixabay.com/api/';
const maxPhotos = 40;
let pageNum = 0;
let keyword = '';
let lightbox = new SimpleLightbox('.gallery a');

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

loadMoreBtn.classList.add('is-hidden');

async function onSearch(event) {
  loadMoreBtn.classList.add('is-hidden');
  event.preventDefault();
  galleryEl.innerHTML = '';
  pageNum = 1;
  keyword = input.value.trim();
  if (keyword === '') {
    return;
  }
  try {
    const data = await fetchPhotoByKeyword(keyword);
    if (data.totalHits === 0) {
      loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      renderPhotosCard(data.hits);
      loadMoreBtn.classList.remove('is-hidden');
      lightbox.refresh();
    }
  } catch (error) {
    console.error(error);
  }
}

async function onLoadMore(event) {
  try {
    const data = await fetchPhotoByKeyword(keyword);
    renderPhotosCard(data.hits);
    lightbox.refresh();
    const totalPages = Math.ceil(data.totalHits / maxPhotos);
    if (pageNum == totalPages) {
      loadMoreBtn.classList.add('is-hidden');
      Notiflix.Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
    }
    pageNum += 1;
  } catch (error) {
    console.error(error);
  }
}
// async function fetchPhotoByKeyword(keyword) {
//   const { data } = await axios.get('', {
//     baseURL: url,
//     params: {
//       key: APIKEY,
//       q: keyword,
//       image_type: 'photo',
//       orientation: 'horizontal',
//       safesearch: true,
//       per_page: maxPhotos,
//       page: pageNum,
//     },
//   });

//   return data;
// }

function renderPhotosCard(photosArray) {
  for (const photo of photosArray) {
    const smallImg = photo.webformatURL;
    const largeImg = photo.largeImageURL;
    const alt = photo.tags;
    const likes = photo.likes;
    const views = photo.views;
    const comments = photo.comments;
    const downloads = photo.downloads;

    const renderCard = `<div class='photo-card'><a href=${largeImg}><img src=${smallImg} alt=${alt} class='img'></a>
    <div class='list'>
    <p><b>🥰 Likes</b><br>${likes}</p>
    <p><b>🙂 Views</b><br>${views}</p>
    <p><b>😜 Comments</b><br>${comments}</p>
    <p><b>🤩 Downloads</b><br>${downloads}</p>
    </div></div>`;

    galleryEl.insertAdjacentHTML('beforeend', renderCard);
  }
}
