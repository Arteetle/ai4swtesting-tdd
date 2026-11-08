class Timesheet {
  constructor() {
    this.timesheets = new Map();
  }

  submitTimesheet(projectName, duration) {
    this.timesheets.set(projectName, duration);
    return true;
  }

  getTimesheets() {
    return Array.from(this.timesheets);
  }
}

module.exports = Timesheet;
