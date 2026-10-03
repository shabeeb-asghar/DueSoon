import { Pressable, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants';

// Small number tile on the dashboard. Tapping it opens the task list pre-filtered.
export default function StatCard({ label, value, color, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pressed: { transform: [{ scale: 0.97 }] },
  value: { fontSize: 28, fontWeight: '800' },
  label: { fontSize: 13, color: COLORS.muted, marginTop: 2, fontWeight: '600' },
});
