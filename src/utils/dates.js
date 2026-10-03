// Date helpers. Due dates are stored as 'YYYY-MM-DD' strings and always
// parsed as *local* dates so time zones never shift a deadline by a day.

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function parseDate(iso) {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function toISO(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function today() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function addDays(iso, days) {
  const date = parseDate(iso);
  date.setDate(date.getDate() + days);
  return toISO(date);
}

// ISO date `n` days from today (negative = in the past).
export function daysFromToday(n) {
  return addDays(toISO(today()), n);
}

// Whole days between today and the given date (negative = overdue).
export function daysUntil(iso) {
  return Math.round((parseDate(iso) - today()) / MS_PER_DAY);
}

// Monday of the week that contains the given date.
export function startOfWeek(iso) {
  const date = parseDate(iso);
  const offset = (date.getDay() + 6) % 7; // Mon = 0 ... Sun = 6
  return addDays(iso, -offset);
}

// "13 Oct"
export function formatShort(iso) {
  const date = parseDate(iso);
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`;
}

// "Mon, 13 Oct"
export function formatLong(iso) {
  return `${DAY_NAMES[parseDate(iso).getDay()]}, ${formatShort(iso)}`;
}

// Human friendly countdown text for a number of days left.
export function countdownLabel(days) {
  if (days < -1) return `${Math.abs(days)} days overdue`;
  if (days === -1) return '1 day overdue';
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `${days} days left`;
}
