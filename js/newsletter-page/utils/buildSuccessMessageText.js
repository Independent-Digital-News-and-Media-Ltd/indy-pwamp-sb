export const buildSuccessMessageText = (numberSelected) => {
  if (numberSelected === 1) {
    return 'You have now signed up to receive 1 newsletter from The Independent';
  } else {
    return `You have now signed up to receive ${numberSelected} newsletters from The Independent`;
  }
};
