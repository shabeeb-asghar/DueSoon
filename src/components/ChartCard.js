import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants';

// White card with a title that wraps each dashboard chart.
export default function ChartCard({ title, subtitle, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  title: { fontSize: 16, fontWeight: '800', color: COLORS.text, paddingHorizontal: 16 },
  subtitle: { fontSize: 12, color: COLORS.muted, marginTop: 2, paddingHorizontal: 16 },
  content: { marginTop: 12, alignItems: 'center' },
});
