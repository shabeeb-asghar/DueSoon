import { Pressable, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants';
import { getContrastText } from '../utils/colors';

// A selectable pill. Used for filters, sorting, course/type/priority pickers.
export default function Chip({ label, selected, onPress, color = COLORS.primary, count }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && { backgroundColor: color, borderColor: color },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.label, selected && { color: getContrastText(color) }]}>
        {label}
        {count !== undefined ? ` · ${count}` : ''}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.card,
    marginRight: 8,
    marginBottom: 8,
  },
  pressed: { opacity: 0.7 },
  label: { color: COLORS.text, fontWeight: '600', fontSize: 13 },
});
