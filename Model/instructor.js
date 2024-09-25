import { User } from "./User.js";

export class Instructor extends User {
  constructor(fN, lN, e, p) {
    super(fN, lN, e, p);
    this.testList = [];
    this.role = "I";
  }
}
