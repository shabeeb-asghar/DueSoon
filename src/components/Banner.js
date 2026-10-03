import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants';

const TYPES = {
  danger: { icon: '⚠️', color: COLORS.dangerText, background: COLORS.dangerSoft },
  warning: { icon: '🔥', color: COLORS.warningText, background: COLORS.warningSoft },
  success: { icon: '✅', color: COLORS.successText, background: COLORS.successSoft },
};

// Coloured alert / recommendation box. type: 'danger' | 'warning' | 'success'
export default function Banner({ type, message, actionLabel, onAction }) {
  const theme = TYPES[type];

  return (
    <View style={[styles.banner, { backgroundColor: theme.background }]}>
      <Text style={styles.icon}>{theme.icon}</Text>
      <Text style={[styles.message, { color: theme.color }]}>{message}</Text>
      {actionLabel && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={[styles.action, { color: theme.color }]}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
  },
  icon: { fontSize: 18, marginRight: 10 },
  message: { flex: 1, fontSize: 13, fontWeight: '600', lineHeight: 18 },
  action: { fontWeight: '800', marginLeft: 10, textDecorationLine: 'underline' },
});
