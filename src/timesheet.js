const MINUTES_PER_HOUR = 60;
const MAX_HOURS_PER_ENTRY = 24;
const MAX_MINUTES_PER_ENTRY = MAX_HOURS_PER_ENTRY * MINUTES_PER_HOUR;
// Tolerance used when converting hours to whole minutes, so values such as
// 1/3 hour (0.333...) are accepted as exactly 20 minutes.
const MINUTE_TOLERANCE = 1e-6;

/**
 * Records time worked per project.
 *
 * Units: every duration passed in and every total returned is in HOURS.
 * Internally, time is stored as whole minutes (integers) so that sums are
 * exact and free of floating-point drift (e.g. 0.1 + 0.2 === 0.3 hours).
 *
 * Project names are matched case-insensitively and ignoring surrounding /
 * repeated whitespace, so "Project A", "project a" and " Project  A " all
 * refer to the same project. The first spelling submitted is kept for display.
 */
class Timesheet {
  constructor() {
    // normalized key -> { name: string, entries: number[] (minutes) }
    this.timesheets = new Map();
  }

  /**
   * Records a duration against a project.
   * @param {string} projectName non-empty project name
   * @param {number} durationHours hours worked; > 0, <= 24, whole minutes
   * @returns {true} when the entry was recorded
   * @throws {TypeError|RangeError} when the input is invalid (nothing is recorded)
   */
  submitTimesheet(projectName, durationHours) {
    // Validate everything before touching state, so an invalid call can never
    // leave a partially updated or corrupted total behind.
    const { key, displayName } = Timesheet.#normalizeProjectName(projectName);
    const minutes = Timesheet.#toMinutes(durationHours);

    let project = this.timesheets.get(key);
    if (!project) {
      project = { name: displayName, entries: [] };
      this.timesheets.set(key, project);
    }

    const newTotal = Timesheet.#sum(project.entries) + minutes;
    if (!Number.isSafeInteger(newTotal)) {
      throw new RangeError(`Total time for project "${project.name}" exceeds the supported range`);
    }

    project.entries.push(minutes);
    return true;
  }

  /**
   * @returns {Array<[string, number]>} [projectName, totalHours] pairs, sorted
   * by project name so the output does not depend on submission order.
   */
  getTimesheets() {
    return Array.from(this.timesheets.values())
      .map((project) => [project.name, Timesheet.#toHours(Timesheet.#sum(project.entries))])
      .sort(([a], [b]) => a.localeCompare(b));
  }

  /**
   * @param {string} projectName
   * @returns {number} total hours for the project; 0 if nothing was submitted
   */
  getTotalHours(projectName) {
    const { key } = Timesheet.#normalizeProjectName(projectName);
    const project = this.timesheets.get(key);
    return project ? Timesheet.#toHours(Timesheet.#sum(project.entries)) : 0;
  }

  /**
   * @param {string} projectName
   * @returns {number[]} the individual submitted durations (hours), in the
   * order they were submitted, so totals can be audited. Returns a copy.
   */
  getEntries(projectName) {
    const { key } = Timesheet.#normalizeProjectName(projectName);
    const project = this.timesheets.get(key);
    return project ? project.entries.map(Timesheet.#toHours) : [];
  }

  static #normalizeProjectName(projectName) {
    if (typeof projectName !== 'string') {
      throw new TypeError(`Project name must be a string, received ${typeof projectName}`);
    }
    const displayName = projectName.trim().replace(/\s+/g, ' ');
    if (displayName === '') {
      throw new RangeError('Project name must not be empty');
    }
    return { key: displayName.toLowerCase(), displayName };
  }

  static #toMinutes(durationHours) {
    if (typeof durationHours !== 'number') {
      throw new TypeError(`Duration must be a number of hours, received ${typeof durationHours}`);
    }
    if (!Number.isFinite(durationHours)) {
      throw new RangeError('Duration must be a finite number of hours');
    }
    if (durationHours <= 0) {
      throw new RangeError('Duration must be greater than 0 hours');
    }
    const exactMinutes = durationHours * MINUTES_PER_HOUR;
    const minutes = Math.round(exactMinutes);
    if (Math.abs(exactMinutes - minutes) > MINUTE_TOLERANCE) {
      throw new RangeError('Duration must be a whole number of minutes');
    }
    if (minutes > MAX_MINUTES_PER_ENTRY) {
      throw new RangeError(`Duration must not exceed ${MAX_HOURS_PER_ENTRY} hours per entry`);
    }
    return minutes;
  }

  static #toHours(minutes) {
    return minutes / MINUTES_PER_HOUR;
  }

  static #sum(entries) {
    return entries.reduce((total, minutes) => total + minutes, 0);
  }
}

module.exports = Timesheet;
