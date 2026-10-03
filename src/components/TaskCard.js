import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants';
import { findCourse } from '../data/courses';
import { formatLong } from '../utils/dates';
import { findPriority } from '../utils/tasks';
import CountdownBadge from './CountdownBadge';

// One task in a list. Tap the card to open details, tap the circle to toggle done.
export default function TaskCard({ task, onPress, onToggleDone }) {
  const course = findCourse(task.courseId);
  const priority = findPriority(task.priority);

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={[styles.strip, { backgroundColor: course.color }]} />

      <Pressable
        onPress={onToggleDone}
        hitSlop={10}
        style={[styles.check, task.done && styles.checkDone]}
      >
        {task.done && <Text style={styles.tick}>✓</Text>}
      </Pressable>

      <View style={styles.body}>
        <Text style={[styles.title, task.done && styles.doneTitle]} numberOfLines={1}>
          {task.title}
        </Text>
        <Text style={styles.meta}>
          {course.short} · {task.type} · {formatLong(task.dueDate)}
        </Text>
        <View style={styles.row}>
          <CountdownBadge task={task} />
          <Text style={styles.hours}>⏱ {task.hours}h</Text>
          <View style={[styles.dot, { backgroundColor: priority.color }]} />
          <Text style={styles.hours}>{priority.label}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pressed: { opacity: 0.85 },
  strip: { width: 5, alignSelf: 'stretch' },
  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  tick: { color: COLORS.text, fontWeight: '800', fontSize: 14 },
  body: { flex: 1, paddingVertical: 12, paddingRight: 12 },
  title: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  doneTitle: { textDecorationLine: 'line-through', color: COLORS.muted },
  meta: { fontSize: 12, color: COLORS.muted, marginTop: 2, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  hours: { fontSize: 12, color: COLORS.muted, marginLeft: 10, fontWeight: '600' },
  dot: { width: 8, height: 8, borderRadius: 4, marginLeft: 10, marginRight: -6 },
});
