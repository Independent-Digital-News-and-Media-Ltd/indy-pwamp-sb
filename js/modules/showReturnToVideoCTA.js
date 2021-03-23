const showReturnToVideoCTA = () => {
  let scrollPosition = 0;
  const videoElement = document.querySelector('#indy-top-container-wrapper');
  const returnToVideoElement = document.querySelector('.scroll-to-video');
  if (videoElement && returnToVideoElement) {
    window.addEventListener('scroll', function () {
      const position = videoElement.getBoundingClientRect();
      const scrollDirection =
        document.body.getBoundingClientRect().top > scrollPosition
          ? 'up'
          : 'down';
      scrollPosition = document.body.getBoundingClientRect().top;
      // show the 'Return to video' CTA if user is scrolling up and video is not in the viewport window
      if (
        scrollDirection === 'up' &&
        position.bottom <= 0 &&
        returnToVideoElement !== null
      ) {
        returnToVideoElement.classList.add('active');
        setTimeout(() => {
          returnToVideoElement.classList.remove('active');
        }, 3500);
      }
    });
  }
};

export default showReturnToVideoCTA;
