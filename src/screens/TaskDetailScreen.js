import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Banner from '../components/Banner';
import Button from '../components/Button';
import CountdownBadge from '../components/CountdownBadge';
import Header from '../components/Header';
import { COLORS, HOURS_PER_DAY } from '../constants';
import { findCourse } from '../data/courses';
import { getContrastText } from '../utils/colors';
import { daysUntil, formatLong } from '../utils/dates';
import { findPriority, getSuggestedStart } from '../utils/tasks';
import { isInCrunchWeek } from '../utils/workload';

// Advice text based on when the student should start working on the task.
function getStartAdvice(task) {
  if (task.done) return { type: 'success', message: 'Completed. Nice work!' };

  const start = getSuggestedStart(task);
  const daysToStart = daysUntil(start);

  if (daysUntil(task.dueDate) < 0) return { type: 'danger', message: 'This is overdue. Submit it as soon as possible.' };
  if (daysToStart < 0) {
    return { type: 'danger', message: `You should have started ${Math.abs(daysToStart)} day(s) ago. Start today.` };
  }
  if (daysToStart === 0) return { type: 'warning', message: 'Start today to finish comfortably.' };
  return { type: 'success', message: `Start by ${formatLong(start)} (in ${daysToStart} day(s)) and you'll be fine.` };
}

export default function TaskDetailScreen({ task, tasks, onBack, onEdit, onDelete, onToggleDone }) {
  const course = findCourse(task.courseId);
  const priority = findPriority(task.priority);
  const advice = getStartAdvice(task);

  const details = [
    { label: 'Course', value: course.name },
    { label: 'Type', value: task.type },
    { label: 'Due', value: formatLong(task.dueDate) },
    { label: 'Effort', value: `${task.hours} hours (~${Math.ceil(task.hours / HOURS_PER_DAY)} day(s) of work)` },
    { label: 'Priority', value: priority.label, color: priority.textColor },
  ];

  return (
    <View style={styles.screen}>
      <Header title="Task details" onBack={onBack} rightLabel="Edit" onRightPress={onEdit} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={[styles.coursePill, { backgroundColor: course.color }]}>
            <Text style={[styles.coursePillText, { color: getContrastText(course.color) }]}>{course.short}</Text>
          </View>
          <Text style={[styles.title, task.done && styles.doneTitle]}>{task.title}</Text>
          <CountdownBadge task={task} />

          <View style={styles.details}>
            {details.map((row) => (
              <View key={row.label} style={styles.row}>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <Text style={[styles.rowValue, row.color && { color: row.color }]}>{row.value}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={styles.section}>Plan</Text>
        <Banner type={advice.type} message={advice.message} />
        {!task.done && isInCrunchWeek(task, tasks) && (
          <Banner type="warning" message="This task falls in a crunch week. Get ahead of it early." />
        )}

        <Text style={styles.section}>Notes</Text>
        <Text style={[styles.notes, !task.notes && styles.noNotes]}>{task.notes || 'No notes added.'}</Text>

        <Button
          label={task.done ? 'Mark as not done' : 'Mark as done'}
          variant={task.done ? 'secondary' : 'primary'}
          onPress={onToggleDone}
          style={styles.button}
        />
        <Button label="Delete task" variant="danger" onPress={onDelete} style={styles.button} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 110 },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  coursePill: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  coursePillText: { fontWeight: '800', fontSize: 12 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginVertical: 10 },
  doneTitle: { textDecorationLine: 'line-through', color: COLORS.muted },
  details: { marginTop: 14 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  rowLabel: { color: COLORS.muted, fontWeight: '600' },
  rowValue: { color: COLORS.text, fontWeight: '700', flexShrink: 1, textAlign: 'right', marginLeft: 16 },
  section: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginTop: 12, marginBottom: 10 },
  notes: { fontSize: 15, color: COLORS.text, lineHeight: 21, marginBottom: 20 },
  noNotes: { color: COLORS.muted, fontStyle: 'italic' },
  button: { marginBottom: 10 },
});
