// Central place for every "magic number" and option list in the app.
// Changing a value here updates the whole UI (useful for live changes in the viva).

// A week with more pending hours than this is flagged as a "crunch week".
export const HEAVY_WEEK_HOURS = 12;

// Countdown colour thresholds (in days left).
export const URGENT_DAYS = 2; // 0-2 days left  -> red
export const SOON_DAYS = 5; //   3-5 days left  -> amber, otherwise green

// How many hours a student can realistically put into one task per day.
// Used to suggest a start date: due date - ceil(hours / HOURS_PER_DAY).
export const HOURS_PER_DAY = 3;

// Number of upcoming weeks shown in the workload chart.
export const WEEKS_TO_SHOW = 4;

// Limits used by form validation.
export const MIN_HOURS = 0.5;
export const MAX_HOURS = 40;
export const TITLE_MAX_LENGTH = 60;
export const NOTES_MAX_LENGTH = 200;

export const TASK_TYPES = ['Quiz', 'Assignment', 'Project', 'Exam'];

// Brand palette (coolors.co): every colour in the app is built from these five.
export const PALETTE = {
  shadowGrey: '#212738',
  vibrantCoral: '#F97068',
  lemonLime: '#D1D646',
  platinum: '#EDF2EF',
  skyAqua: '#57C4E5',
};

// `color` is for dots/fills, `textColor` is a darker shade that is readable as text.
export const PRIORITIES = [
  { key: 'high', label: 'High', weight: 3, color: PALETTE.vibrantCoral, textColor: '#C94A38' },
  { key: 'medium', label: 'Medium', weight: 2, color: PALETTE.lemonLime, textColor: '#7A7D12' },
  { key: 'low', label: 'Low', weight: 1, color: PALETTE.skyAqua, textColor: '#1F7FA0' },
];

export const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'done', label: 'Done' },
];

export const SORT_OPTIONS = [
  { key: 'due', label: 'Due date' },
  { key: 'priority', label: 'Priority' },
  { key: 'hours', label: 'Effort' },
];

// Semantic colours used by components.
// Coral = urgent/danger, Lime = soon/warning, Aqua = safe/done, Shadow Grey = primary actions & text.
export const COLORS = {
  primary: PALETTE.shadowGrey,
  primarySoft: '#DDF3FA', // light tint of sky aqua
  accent: PALETTE.lemonLime,
  background: PALETTE.platinum,
  card: '#FFFFFF',
  text: PALETTE.shadowGrey,
  muted: '#5F6475',
  border: '#D6DEDA',
  danger: PALETTE.vibrantCoral,
  dangerText: '#C94A38',
  dangerSoft: '#FEE6E2',
  warning: PALETTE.lemonLime,
  warningText: '#7A7D12',
  warningSoft: '#F4F6CF',
  success: PALETTE.skyAqua,
  successText: '#1F7FA0',
  successSoft: '#DDF3FA',
};
