export default () => {
  const stickyAdLink = document.querySelector('.sticky-ad-close-button-press');

  stickyAdLink?.addEventListener('click', () => {
    document.getElementById('stickyFooterRoot').style.display = 'none';
  });
};
