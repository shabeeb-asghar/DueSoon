import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants';
import Button from './Button';

// Friendly placeholder for lists or charts with nothing to show.
export default function EmptyState({ emoji, title, message, actionLabel, onAction }) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && <Button label={actionLabel} onPress={onAction} variant="secondary" style={styles.button} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 16 },
  emoji: { fontSize: 40, marginBottom: 8 },
  title: { fontSize: 16, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  message: { fontSize: 13, color: COLORS.muted, textAlign: 'center', marginTop: 4 },
  button: { marginTop: 14 },
});
