import { Pressable, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants';

const VARIANTS = {
  primary: { background: COLORS.primary, text: '#fff' },
  secondary: { background: COLORS.primarySoft, text: COLORS.primary },
  danger: { background: COLORS.dangerSoft, text: COLORS.dangerText },
};

// Shared button. variant: 'primary' | 'secondary' | 'danger'
export default function Button({ label, onPress, variant = 'primary', style }) {
  const colors = VARIANTS[variant];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, { backgroundColor: colors.background }, pressed && styles.pressed, style]}
    >
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 14, alignItems: 'center' },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  label: { fontSize: 15, fontWeight: '700' },
});
