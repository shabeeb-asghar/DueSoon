import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants';

// Label + input (children) + error or hint text underneath.
export default function FormField({ label, error, hint, children }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  error: { color: COLORS.dangerText, fontSize: 12, marginTop: 4, fontWeight: '600' },
  hint: { color: COLORS.muted, fontSize: 12, marginTop: 4 },
});
