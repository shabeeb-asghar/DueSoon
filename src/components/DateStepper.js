import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants';
import { addDays, countdownLabel, daysFromToday, daysUntil, formatLong } from '../utils/dates';
import Chip from './Chip';

const QUICK_PICKS = [
  { label: 'Today', offset: 0 },
  { label: 'Tomorrow', offset: 1 },
  { label: 'In 3 days', offset: 3 },
  { label: 'Next week', offset: 7 },
];

// Touch-friendly date picker: -/+ one day, or jump with a quick pick.
// Works the same on Android, iOS and web without a native date picker.
export default function DateStepper({ value, onChange, hasError }) {
  return (
    <View>
      <View style={[styles.stepper, hasError && styles.errorBorder]}>
        <StepButton label="−" onPress={() => onChange(addDays(value, -1))} />
        <View style={styles.center}>
          <Text style={styles.date}>{formatLong(value)}</Text>
          <Text style={styles.countdown}>{countdownLabel(daysUntil(value))}</Text>
        </View>
        <StepButton label="+" onPress={() => onChange(addDays(value, 1))} />
      </View>

      <View style={styles.quick}>
        {QUICK_PICKS.map((pick) => {
          const date = daysFromToday(pick.offset);
          return <Chip key={pick.label} label={pick.label} selected={date === value} onPress={() => onChange(date)} />;
        })}
      </View>
    </View>
  );
}

function StepButton({ label, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.step, pressed && { opacity: 0.6 }]}>
      <Text style={styles.stepText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 6,
    marginBottom: 10,
  },
  errorBorder: { borderColor: COLORS.danger },
  step: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepText: { fontSize: 22, fontWeight: '700', color: COLORS.primary },
  center: { flex: 1, alignItems: 'center' },
  date: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  countdown: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  quick: { flexDirection: 'row', flexWrap: 'wrap' },
});
