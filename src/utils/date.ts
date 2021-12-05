export default class PipotDate extends Date {
  get year() {
    return this.getFullYear();
  }

  get month() {
    return this.getMonth() + 1;
  }

  get monthDay() {
    return this.getDate();
  }

  get hours() {
    return this.getHours();
  }

  get minutes() {
    return this.getMinutes();
  }

  get seconds() {
    return this.getSeconds();
  }

  public getKebabDateTime() {
    return [
      this.year,
      this.month,
      this.monthDay,
      this.hours,
      this.minutes,
      this.seconds
    ].join("-");
  }
}