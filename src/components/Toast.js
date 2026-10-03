import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { COLORS } from '../constants';

// Short feedback message that slides up after an action (e.g. "Task added", "Task deleted · Undo").
// toast: { id, message, actionLabel?, onAction? } or null
export default function Toast({ toast }) {
  const animation = useRef(new Animated.Value(0)).current;

  // Replay the slide-in each time a new toast (new id) arrives.
  useEffect(() => {
    if (!toast) return;
    animation.setValue(0);
    Animated.spring(animation, { toValue: 1, useNativeDriver: true, friction: 7 }).start();
  }, [toast?.id]);

  if (!toast) return null;

  const translateY = animation.interpolate({ inputRange: [0, 1], outputRange: [40, 0] });

  return (
    <Animated.View style={[styles.toast, { opacity: animation, transform: [{ translateY }] }]}>
      <Text style={styles.message}>{toast.message}</Text>
      {toast.actionLabel && (
        <Pressable onPress={toast.onAction} hitSlop={10}>
          <Text style={styles.action}>{toast.actionLabel}</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 16,
    right: 96,
    bottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.text,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  message: { flex: 1, color: '#fff', fontWeight: '600' },
  action: { color: COLORS.accent, fontWeight: '800', marginLeft: 12 },
});
