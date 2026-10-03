import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import ChipGroup from '../components/ChipGroup';
import EmptyState from '../components/EmptyState';
import FloatingButton from '../components/FloatingButton';
import Header from '../components/Header';
import TaskCard from '../components/TaskCard';
import { COLORS, SORT_OPTIONS, STATUS_FILTERS } from '../constants';
import { COURSES } from '../data/courses';
import { filterTasks, getStatus, sortTasks } from '../utils/tasks';

const COURSE_OPTIONS = [
  { key: 'all', label: 'All courses' },
  ...COURSES.map((course) => ({ key: course.id, label: course.short, color: course.color })),
];

// `filters` ({ query, status, courseId, sortKey }) is owned by App so it is kept when returning to this view.
export default function TaskListScreen({ tasks, filters, onChangeFilters, onBack, onOpenTask, onToggleDone, onAddTask }) {
  const { query, status, courseId, sortKey } = filters;

  function updateFilter(name, value) {
    onChangeFilters({ ...filters, [name]: value });
  }

  // Add a live count to every status chip, e.g. "Overdue · 2".
  const statusOptions = STATUS_FILTERS.map((filter) => ({
    ...filter,
    count: filter.key === 'all' ? tasks.length : tasks.filter((task) => getStatus(task) === filter.key).length,
  }));

  const visibleTasks = sortTasks(filterTasks(tasks, { query, status, courseId }), sortKey);
  const hasActiveFilters = query !== '' || status !== 'all' || courseId !== 'all';

  function clearFilters() {
    onChangeFilters({ ...filters, query: '', status: 'all', courseId: 'all' });
  }

  function renderEmpty() {
    if (tasks.length === 0) {
      return (
        <EmptyState emoji="📭" title="No tasks yet" message="Tap + to add your first deadline." actionLabel="Add task" onAction={onAddTask} />
      );
    }
    return (
      <EmptyState
        emoji="🔍"
        title="No tasks match"
        message="Try a different search or filter."
        actionLabel={hasActiveFilters ? 'Clear filters' : undefined}
        onAction={clearFilters}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <Header title="All tasks" subtitle={`Showing ${visibleTasks.length} of ${tasks.length}`} onBack={onBack} />

      <View style={styles.searchBox}>
        <TextInput
          style={styles.search}
          value={query}
          onChangeText={(text) => updateFilter('query', text)}
          placeholder="Search by title or course…"
          placeholderTextColor={COLORS.muted}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <ChipGroup scroll options={statusOptions} selectedKey={status} onSelect={(key) => updateFilter('status', key)} />
      <ChipGroup scroll options={COURSE_OPTIONS} selectedKey={courseId} onSelect={(key) => updateFilter('courseId', key)} />

      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort by</Text>
        <ChipGroup options={SORT_OPTIONS} selectedKey={sortKey} onSelect={(key) => updateFilter('sortKey', key)} />
      </View>

      <FlatList
        data={visibleTasks}
        keyExtractor={(task) => task.id}
        renderItem={({ item }) => (
          <TaskCard task={item} onPress={() => onOpenTask(item.id)} onToggleDone={() => onToggleDone(item.id)} />
        )}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
      />

      <FloatingButton onPress={onAddTask} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  searchBox: { paddingHorizontal: 16, marginBottom: 12 },
  search: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  sortRow: { flexDirection: 'row', alignItems: 'baseline', paddingHorizontal: 16, marginTop: 4 },
  sortLabel: { fontSize: 13, color: COLORS.muted, fontWeight: '700', marginRight: 10 },
  list: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 110 },
});
