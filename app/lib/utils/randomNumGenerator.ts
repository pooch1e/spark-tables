//all dice
export const randomNumGenerator = (num: number) => {
  if (num === 4) {
    const randomNumber: number = Math.floor(Math.random() * 4) + 1;
    return randomNumber;
  } else if (num === 9) {
    const randomNumber: number = Math.floor(Math.random() * 9) + 1;
    return randomNumber;
  } else {
    const randomNumber: number = Math.floor(Math.random() * 12) + 1;
    return randomNumber;
  }
};
