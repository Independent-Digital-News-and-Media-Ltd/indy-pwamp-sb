export default () => {
  const leftButton = document.getElementById('leftButton');
  const rightButton = document.getElementById('rightButton');
  let scrollAmount = 0;
  let content;
  let scrollMax;

  if (leftButton && rightButton) {
    content = leftButton.previousElementSibling;
    scrollMax = content.clientWidth;
    // Check if there is no scrolling area, hide the right arrow
    if (scrollMax === content.scrollWidth) rightButton.style.display = 'none';
    else rightButton.style.display = 'block';

    rightButton.addEventListener('click', scrollRight);
    leftButton.addEventListener('click', scrollLeft);

    window.addEventListener('resize', function () {
      scrollMax = content.clientWidth;
      window.location = window.location.href;
    });
  }

  function scrollRight() {
    content.scrollTo({
      top: 0,
      left: Math.min((scrollAmount += 500), scrollMax),
      behavior: 'smooth',
    });
    content.style.marginLeft = '16px';
    content.scrollLeft = scrollAmount;
    // Hide the right arrow once the scroll reaches its end
    if (content.scrollWidth === Math.floor(scrollMax + content.scrollLeft)) {
      rightButton.style.display = 'none';
    }
    leftButton.style.display = 'block';
  }

  function scrollLeft() {
    content.scrollTo({
      top: 0,
      left: Math.min((scrollAmount -= 500), scrollMax),
      behavior: 'smooth',
    });
    content.style.marginLeft = '0';
    content.scrollLeft = scrollAmount;
    // Hide the left arrow once the scroll reaches its end
    if (content.scrollLeft === 0) {
      leftButton.style.display = 'none';
    }
    rightButton.style.display = 'block';
  }
};
