export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomLowerCase(): string {
  return String.fromCharCode(randomInt(97, 122));
}

function randomUpperCase(): string {
  return String.fromCharCode(randomInt(65, 90));
}

export function getRandomString(length: number): string {
  if (!Number.isInteger(length) || length < 0)
    throw Error(`The length must be a positive integer. ${length} given instead.`);

  let randomString = "";

  for (let i = 1; i <= length; i++) {
    if (i % 3 === 0)
      randomString += randomUpperCase();
    else if (i % 2 === 0)
      randomString += randomLowerCase();
    else
      randomString += randomInt(0, 9);
  }

  return shuffle(randomString) as string;
}

function shuffle(arrOrStr: string | any[]): string | any[] {
  const isString = typeof arrOrStr === "string";
  const arr = (isString) ? arrOrStr.split("") : arrOrStr.slice();

  for (let i = 0; i < arr.length; i++) {
    const j = randomInt(0, arr.length);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return (isString) ? arr.join("") : arr;
}