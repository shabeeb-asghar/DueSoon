import { Pressable, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants';

// Round "+" button floating over the content, used to add a task.
export default function FloatingButton({ onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.fab, pressed && styles.pressed]}>
      <Text style={styles.plus}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 28,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  pressed: { transform: [{ scale: 0.92 }] },
  plus: { color: COLORS.accent, fontSize: 32, lineHeight: 34, fontWeight: '400' },
});
