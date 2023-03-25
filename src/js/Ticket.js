// eslint-disable-next-line import/no-extraneous-dependencies
const moment = require('moment');

export class Ticket {
  constructor() {
    this.name = String;
    this.status = false;
    this.created = moment(new Date()).format('YYYY.MM.DD HH:mm');
    this.description = String;
  }

  addNewTicket(name, description) {
    this.name = name;
    this.description = description;
  }
}
