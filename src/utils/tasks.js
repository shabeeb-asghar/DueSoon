import { COLORS, HOURS_PER_DAY, PRIORITIES, SOON_DAYS, URGENT_DAYS } from '../constants';
import { findCourse } from '../data/courses';
import { addDays, daysUntil } from './dates';

// 'done' | 'overdue' | 'pending'
export function getStatus(task) {
  if (task.done) return 'done';
  if (daysUntil(task.dueDate) < 0) return 'overdue';
  return 'pending';
}

export function findPriority(key) {
  return PRIORITIES.find((priority) => priority.key === key);
}

// Colour for the countdown badge, based on how close the deadline is.
export function getUrgency(task) {
  const days = daysUntil(task.dueDate);
  if (task.done) return { color: COLORS.successText, background: COLORS.successSoft };
  if (days <= URGENT_DAYS) return { color: COLORS.dangerText, background: COLORS.dangerSoft };
  if (days <= SOON_DAYS) return { color: COLORS.warningText, background: COLORS.warningSoft };
  return { color: COLORS.successText, background: COLORS.successSoft };
}

// Search + status filter + course filter, applied together.
export function filterTasks(tasks, { query, status, courseId }) {
  const text = query.trim().toLowerCase();

  return tasks.filter((task) => {
    const course = findCourse(task.courseId);
    const matchesText =
      text === '' ||
      task.title.toLowerCase().includes(text) ||
      course.name.toLowerCase().includes(text) ||
      course.short.toLowerCase().includes(text);
    const matchesStatus = status === 'all' || getStatus(task) === status;
    const matchesCourse = courseId === 'all' || task.courseId === courseId;

    return matchesText && matchesStatus && matchesCourse;
  });
}

// Returns a new sorted array (never mutates state). Completed tasks always sink to the bottom.
export function sortTasks(tasks, sortKey) {
  const compareDue = (a, b) => a.dueDate.localeCompare(b.dueDate);

  const comparators = {
    due: compareDue,
    priority: (a, b) => findPriority(b.priority).weight - findPriority(a.priority).weight || compareDue(a, b),
    hours: (a, b) => b.hours - a.hours || compareDue(a, b),
  };

  return [...tasks].sort((a, b) => Number(a.done) - Number(b.done) || comparators[sortKey](a, b));
}

// Numbers for the dashboard stat cards.
export function getSummary(tasks) {
  const pending = tasks.filter((task) => !task.done);

  return {
    dueToday: pending.filter((task) => daysUntil(task.dueDate) === 0).length,
    dueThisWeek: pending.filter((task) => {
      const days = daysUntil(task.dueDate);
      return days >= 0 && days <= 7;
    }).length,
    overdue: pending.filter((task) => daysUntil(task.dueDate) < 0).length,
    done: tasks.length - pending.length,
  };
}

// The date a student should start so the work fits into HOURS_PER_DAY chunks.
export function getSuggestedStart(task) {
  const daysNeeded = Math.ceil(task.hours / HOURS_PER_DAY);
  return addDays(task.dueDate, -daysNeeded);
}
