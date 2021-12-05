export default class Randomizer {
  static randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomLowerCase() {
    return String.fromCharCode(this.randomInt(97, 122));
  }

  static randomUpperCase() {
    return String.fromCharCode(this.randomInt(65, 90));
  }

  static shuffle(arrOrStr: string | any[]): string | any[] {
    const isString = typeof arrOrStr === "string";
    const arr = (isString) ? arrOrStr.split("") : arrOrStr.slice();

    for (let i = 0; i < arr.length; i++) {
      const j = this.randomInt(0, arr.length);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return (isString) ? arr.join("") : arr;
  }

  static generateVerifString(length: number) {
    if (!Number.isInteger(length) || length < 0)
      throw Error(`The length must be a positive integer. ${length} given instead.`);

    let verif_string = "";

    for (let i = 1; i <= length; i++) {
      if (i % 3 === 0)
        verif_string += this.randomUpperCase();
      else if (i % 2 === 0)
        verif_string += this.randomLowerCase();
      else
        verif_string += this.randomInt(0, 9);
    }

    return this.shuffle(verif_string) as string;
  }
}