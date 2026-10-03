import { HEAVY_WEEK_HOURS, WEEKS_TO_SHOW } from '../constants';
import { COURSES } from '../data/courses';
import { addDays, formatShort, startOfWeek, toISO, today } from './dates';

// Groups pending tasks into the upcoming weeks and totals their estimated hours.
// Result: [{ start, label, hours, tasks, isHeavy }, ...]
export function getWeeklyWorkload(tasks, weeks = WEEKS_TO_SHOW) {
  const firstWeek = startOfWeek(toISO(today()));

  return Array.from({ length: weeks }, (_, index) => {
    const start = addDays(firstWeek, index * 7);
    const end = addDays(start, 7);
    const weekTasks = tasks.filter((task) => !task.done && task.dueDate >= start && task.dueDate < end);
    const hours = weekTasks.reduce((total, task) => total + task.hours, 0);

    let label = formatShort(start);
    if (index === 0) label = 'This wk';
    if (index === 1) label = 'Next wk';

    return { start, label, hours, tasks: weekTasks, isHeavy: hours > HEAVY_WEEK_HOURS };
  });
}

// Finds the first crunch week and recommends the biggest task in it to start early.
export function getCrunchAdvice(tasks) {
  const crunchWeek = getWeeklyWorkload(tasks).find((week) => week.isHeavy);
  if (!crunchWeek) return null;

  const biggestTask = crunchWeek.tasks.reduce((biggest, task) => (task.hours > biggest.hours ? task : biggest));
  const weekName = crunchWeek.label.endsWith('wk') ? crunchWeek.label.replace('wk', 'week') : `Week of ${crunchWeek.label}`;

  return {
    week: crunchWeek,
    task: biggestTask,
    message: `${weekName} is heavy: ${crunchWeek.tasks.length} tasks, ~${crunchWeek.hours} hrs. Start "${biggestTask.title}" early.`,
  };
}

// Is the given task inside a crunch week?
export function isInCrunchWeek(task, tasks) {
  return getWeeklyWorkload(tasks).some((week) => week.isHeavy && week.tasks.some((t) => t.id === task.id));
}

// Pending hours per course, only for courses that still have pending work (pie chart).
export function getPendingHoursByCourse(tasks) {
  return COURSES.map((course) => ({
    course,
    hours: tasks
      .filter((task) => task.courseId === course.id && !task.done)
      .reduce((total, task) => total + task.hours, 0),
  })).filter((item) => item.hours > 0);
}

// Completion ratio (0-1) per course that has at least one task (progress chart).
export function getCompletionByCourse(tasks) {
  return COURSES.map((course) => {
    const courseTasks = tasks.filter((task) => task.courseId === course.id);
    const doneCount = courseTasks.filter((task) => task.done).length;
    return { course, total: courseTasks.length, ratio: courseTasks.length ? doneCount / courseTasks.length : 0 };
  }).filter((item) => item.total > 0);
}
