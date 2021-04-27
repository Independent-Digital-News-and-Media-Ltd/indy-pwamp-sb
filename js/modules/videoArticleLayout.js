import axios from 'axios';

const getVideos = (section, varticles) => {
  if (varticles) {
    const videoIDs = varticles.join(',');
    axios
      .get(
        `https://videohub.playinc.uk.com/api/independent/videos?ids=${videoIDs}&access_token=e61450c5546a6193096dc3785f577ae74e2c84c9`,
      )
      .then((response) => {
        section.innerHTML = renderComponent(response.data.videos);
      })
      .catch((error) => console.error(error));
  }
};

const isLive = (url) => {
  const urlArray = url.split('.');
  return urlArray[urlArray.length - 1] === 'm3u8' ? true : false;
};

const renderComponent = (videos) =>
  videos
    .map(
      (video) => `<a href="${video.link}" class="varticle-layout__article">
        <div class="varticle-layout__image-wrapper">
          <img
            src="${video.image}"
            alt=""
            class="varticle-layout__image"
          />
        </div>
        <div class="varticle-layout__capsules">
          ${
            isLive(video.mp4)
              ? '<span class="varticle-layout__capsule-live">live</span>'
              : ''
          }
          <span class="varticle-layout__capsule">
            ${video.primaryPlaylistName}
          </span>
        </div>
        <h2 class="video-article-title">
          <span class="video-article-link">
            ${video.title}
          </span>
        </h2>
      </a>`,
    )
    .join('');

export default () => {
  const sections = document.querySelectorAll('.js-varticle-layout');
  sections.forEach((section) =>
    getVideos(section, section.dataset?.varticles.split(',')),
  );
};
