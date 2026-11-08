class Timesheet {
  constructor() {
    this.timesheets = new Map();
  }

  submitTimesheet(projectName, duration) {
    if (this.timesheets.has(projectName)) {
      this.timesheets.set(projectName, this.timesheets.get(projectName) + duration);
    } else {
      this.timesheets.set(projectName, duration);
    }
    return true;
  }

  getTimesheets() {
    return Array.from(this.timesheets);
  }

  getTotalHours(projectName) {
    return this.timesheets.get(projectName);
  }
}

module.exports = Timesheet;
