import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Banner from '../components/Banner';
import Button from '../components/Button';
import ChipGroup from '../components/ChipGroup';
import DateStepper from '../components/DateStepper';
import FormField from '../components/FormField';
import Header from '../components/Header';
import { COLORS, NOTES_MAX_LENGTH, PRIORITIES, TASK_TYPES, TITLE_MAX_LENGTH } from '../constants';
import { COURSES } from '../data/courses';
import { daysFromToday } from '../utils/dates';
import { validateTask } from '../utils/validation';
import { getWeeklyWorkload } from '../utils/workload';

const COURSE_OPTIONS = COURSES.map((course) => ({ key: course.id, label: course.short, color: course.color }));
const TYPE_OPTIONS = TASK_TYPES.map((type) => ({ key: type, label: type }));
const PRIORITY_OPTIONS = PRIORITIES.map((priority) => ({ key: priority.key, label: priority.label, color: priority.color }));

// Starting values: the task being edited, or sensible defaults for a new one.
function getInitialForm(task) {
  if (task) return { ...task, hours: String(task.hours) };
  return {
    title: '',
    courseId: '',
    type: 'Assignment',
    dueDate: daysFromToday(3),
    hours: '',
    priority: 'medium',
    notes: '',
  };
}

// Shows how the new/edited task changes the workload of the week it lands in.
function getWorkloadPreview(form, tasks, originalTask) {
  const draft = { ...form, id: originalTask?.id ?? 'draft', hours: Number(form.hours), done: false };
  const otherTasks = tasks.filter((task) => task.id !== draft.id);
  const week = getWeeklyWorkload([...otherTasks, draft]).find((w) => w.tasks.includes(draft));
  if (!week) return null;

  const weekName = week.label.endsWith('wk') ? week.label.replace('wk', 'week') : `The week of ${week.label}`;
  return week.isHeavy
    ? { type: 'warning', message: `${weekName} becomes a crunch week (~${week.hours} hrs). Plan to start early.` }
    : { type: 'success', message: `${weekName} will have ~${week.hours} hrs of work. Manageable.` };
}

export default function TaskFormScreen({ task, tasks, onCancel, onSave }) {
  const [form, setForm] = useState(() => getInitialForm(task));
  const [submitted, setSubmitted] = useState(false);

  const isEditing = Boolean(task);
  const errors = validateTask(form, tasks, task);
  const errorCount = Object.keys(errors).length;
  // Errors only appear after the first save attempt, then update live as the user types.
  const visibleErrors = submitted ? errors : {};
  const preview = errors.hours || errors.dueDate ? null : getWorkloadPreview(form, tasks, task);

  function updateField(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function handleSave() {
    setSubmitted(true);
    if (errorCount > 0) return;

    onSave({
      ...form,
      title: form.title.trim(),
      notes: form.notes.trim(),
      hours: Number(form.hours),
    });
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title={isEditing ? 'Edit task' : 'New task'} onBack={onCancel} />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {submitted && errorCount > 0 && (
          <Banner type="danger" message={`Please fix ${errorCount} ${errorCount === 1 ? 'field' : 'fields'} below.`} />
        )}

        <FormField label="Title" error={visibleErrors.title} hint={`${form.title.length}/${TITLE_MAX_LENGTH}`}>
          <TextInput
            style={[styles.input, visibleErrors.title && styles.inputError]}
            value={form.title}
            onChangeText={(text) => updateField('title', text)}
            placeholder="e.g. ER diagram assignment"
            placeholderTextColor={COLORS.muted}
            maxLength={TITLE_MAX_LENGTH}
            autoCapitalize="sentences"
            returnKeyType="done"
          />
        </FormField>

        <FormField label="Course" error={visibleErrors.courseId}>
          <ChipGroup options={COURSE_OPTIONS} selectedKey={form.courseId} onSelect={(id) => updateField('courseId', id)} />
        </FormField>

        <FormField label="Type">
          <ChipGroup options={TYPE_OPTIONS} selectedKey={form.type} onSelect={(type) => updateField('type', type)} />
        </FormField>

        <FormField label="Due date" error={visibleErrors.dueDate}>
          <DateStepper value={form.dueDate} onChange={(date) => updateField('dueDate', date)} hasError={!!visibleErrors.dueDate} />
        </FormField>

        <FormField label="Estimated hours" error={visibleErrors.hours} hint="How long will this realistically take?">
          <TextInput
            style={[styles.input, visibleErrors.hours && styles.inputError]}
            value={form.hours}
            onChangeText={(text) => updateField('hours', text)}
            placeholder="e.g. 4"
            placeholderTextColor={COLORS.muted}
            keyboardType="decimal-pad"
            maxLength={4}
          />
        </FormField>

        {preview && <Banner type={preview.type} message={preview.message} />}

        <FormField label="Priority">
          <ChipGroup options={PRIORITY_OPTIONS} selectedKey={form.priority} onSelect={(key) => updateField('priority', key)} />
        </FormField>

        <FormField label="Notes (optional)" hint={`${form.notes.length}/${NOTES_MAX_LENGTH}`}>
          <TextInput
            style={[styles.input, styles.notes]}
            value={form.notes}
            onChangeText={(text) => updateField('notes', text)}
            placeholder="Submission link, chapters to cover…"
            placeholderTextColor={COLORS.muted}
            maxLength={NOTES_MAX_LENGTH}
            multiline
            textAlignVertical="top"
          />
        </FormField>

        <View style={styles.actions}>
          <Button label="Cancel" variant="secondary" onPress={onCancel} style={styles.actionButton} />
          <Button label={isEditing ? 'Save changes' : 'Add task'} onPress={handleSave} style={styles.actionButton} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 60 },
  input: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  inputError: { borderColor: COLORS.danger },
  notes: { minHeight: 90 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  actionButton: { width: '48%' },
});
