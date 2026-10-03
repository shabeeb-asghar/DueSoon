import { MAX_HOURS, MIN_HOURS } from '../constants';
import { daysUntil } from './dates';

// Validates the add/edit form. Returns an object of { fieldName: message };
// an empty object means the form is valid.
// `originalTask` is the task being edited (null when adding a new one).
export function validateTask(form, tasks, originalTask) {
  const errors = {};
  const title = form.title.trim();

  if (title === '') {
    errors.title = 'Give the task a title.';
  } else if (title.length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  } else {
    const duplicate = tasks.some(
      (task) =>
        task.id !== originalTask?.id &&
        task.courseId === form.courseId &&
        task.title.trim().toLowerCase() === title.toLowerCase()
    );
    if (duplicate) errors.title = 'This course already has a task with this title.';
  }

  if (!form.courseId) errors.courseId = 'Pick a course.';

  // An overdue task being edited may keep its old date, but a new past date is not allowed.
  const dateChanged = originalTask?.dueDate !== form.dueDate;
  if (dateChanged && daysUntil(form.dueDate) < 0) {
    errors.dueDate = 'Due date cannot be in the past.';
  }

  const hours = Number(form.hours);
  if (form.hours.trim() === '') {
    errors.hours = 'Estimate how many hours this will take.';
  } else if (Number.isNaN(hours)) {
    errors.hours = 'Hours must be a number.';
  } else if (hours < MIN_HOURS || hours > MAX_HOURS) {
    errors.hours = `Enter between ${MIN_HOURS} and ${MAX_HOURS} hours.`;
  }

  return errors;
}
