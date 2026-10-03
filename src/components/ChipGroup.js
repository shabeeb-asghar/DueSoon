import { ScrollView, StyleSheet, View } from 'react-native';
import Chip from './Chip';

// Renders a list of options as chips; exactly one can be selected.
// options: [{ key, label, color?, count? }]
// `scroll` puts the chips in a horizontal scroller instead of wrapping them.
export default function ChipGroup({ options, selectedKey, onSelect, scroll = false }) {
  const chips = options.map((option) => (
    <Chip
      key={option.key}
      label={option.label}
      color={option.color}
      count={option.count}
      selected={option.key === selectedKey}
      onPress={() => onSelect(option.key)}
    />
  ));

  if (scroll) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scroll}
      >
        {chips}
      </ScrollView>
    );
  }

  return <View style={styles.wrap}>{chips}</View>;
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 0, flexShrink: 0 }, // keep the row at its natural height
  scroll: { paddingHorizontal: 16 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
});
