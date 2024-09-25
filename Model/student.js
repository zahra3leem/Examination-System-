import { User } from "./User.js";

export class Student extends User {
  constructor(fN, lN, e, p) {
    super(fN, lN, e, p);
    this.lastRating = [];
    this.role = "S";
  }
}
