export default class Comment {
  constructor(data) {
    this.id = data[`id`];
    this.author = data[`author`];
    this.comment = data[`comment`];
    this.date = data[`date`] ? new Date(data[`date`]) : null;
    this.emotion = data[`emotion`];
  }

  toRAW() {
    return {
      'id': this.id,
      'author': this.author,
      'comment': this.comment,
      'date': this.date ? this.date.toISOString() : null,
      'emotion': this.emotion,
    };
  }

  static parseComment(comment) {
    return new Comment(comment);
  }

  static parseComments(comments) {
    return comments.map(Comment.parseComment);
  }

  static clone(comment) {
    return new Comment(comment.toRaw());
  }
}

