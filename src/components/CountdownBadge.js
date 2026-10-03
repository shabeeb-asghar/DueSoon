import { StyleSheet, Text, View } from 'react-native';
import { countdownLabel, daysUntil } from '../utils/dates';
import { getUrgency } from '../utils/tasks';

// Coloured "3 days left" / "Due today" / "2 days overdue" / "Done" pill.
export default function CountdownBadge({ task }) {
  const urgency = getUrgency(task);
  const label = task.done ? 'Done' : countdownLabel(daysUntil(task.dueDate));

  return (
    <View style={[styles.badge, { backgroundColor: urgency.background }]}>
      <Text style={[styles.text, { color: urgency.color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  text: { fontSize: 12, fontWeight: '700' },
});
