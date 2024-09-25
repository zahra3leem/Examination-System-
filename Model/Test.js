export class Test {
  constructor(id,author, name ,img, type,timer,questions, difficulty) {
    this.id=id;
    this.author = author;
    this.name = name;
    this.img=img;
    this.type = type;
    this.timer=timer
    this.questions = questions;
    this.numOfQuestions = questions.length;
    this.difficulty = difficulty;
  }
 
}
