import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants';

// Top header shown on every view. The back button only renders when `onBack` is passed.
export default function Header({ title, subtitle, onBack, rightLabel, onRightPress }) {
  return (
    <View style={styles.container}>
      {onBack && (
        <Pressable onPress={onBack} hitSlop={12} style={styles.back}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
      )}

      <View style={styles.titles}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {rightLabel && (
        <Pressable onPress={onRightPress} hitSlop={8} style={styles.right}>
          <Text style={styles.rightText}>{rightLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  back: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backText: { fontSize: 26, lineHeight: 28, color: COLORS.text, marginTop: -2 },
  titles: { flex: 1 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  right: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.primarySoft,
  },
  rightText: { color: COLORS.primary, fontWeight: '700' },
});
