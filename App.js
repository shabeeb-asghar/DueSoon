import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { BackHandler, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Toast from './src/components/Toast';
import { COLORS } from './src/constants';
import { INITIAL_TASKS } from './src/data/tasks';
import DashboardScreen from './src/screens/DashboardScreen';
import TaskDetailScreen from './src/screens/TaskDetailScreen';
import TaskFormScreen from './src/screens/TaskFormScreen';
import TaskListScreen from './src/screens/TaskListScreen';

const TOAST_DURATION_MS = 3000;
const DEFAULT_FILTERS = { query: '', status: 'all', courseId: 'all', sortKey: 'due' };

export default function App() {
  // ---- Application data ----
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  // ---- Which view is showing (no navigation library: views are switched with state) ----
  // The array remembers where we came from so "back" returns to the previous view.
  const [views, setViews] = useState(['dashboard']);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  // List filters live here (not in the list view) so they survive opening a task and coming back.
  const [listFilters, setListFilters] = useState(DEFAULT_FILTERS);

  const [toast, setToast] = useState(null);

  const currentView = views[views.length - 1];
  const selectedTask = tasks.find((task) => task.id === selectedTaskId);
  const editingTask = tasks.find((task) => task.id === editingTaskId) ?? null;

  function showView(view) {
    setViews((previous) => [...previous, view]);
  }

  function goBack() {
    setViews((previous) => (previous.length > 1 ? previous.slice(0, -1) : previous));
  }

  // Android hardware back button returns to the previous view instead of closing the app.
  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (views.length === 1) return false;
      goBack();
      return true;
    });
    return () => subscription.remove();
  }, [views]);

  // Hide the toast automatically after a few seconds.
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  function showToast(message, actionLabel, onAction) {
    setToast({ id: Date.now(), message, actionLabel, onAction });
  }

  // ---- Event handlers passed down to the views ----
  // Opening the list from the dashboard starts fresh with only the chosen status filter.
  function openList(status) {
    setListFilters({ ...DEFAULT_FILTERS, status });
    showView('list');
  }

  function openTask(taskId) {
    setSelectedTaskId(taskId);
    showView('detail');
  }

  function openForm(taskId = null) {
    setEditingTaskId(taskId);
    showView('form');
  }

  function toggleDone(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    setTasks((previous) => previous.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)));
    showToast(task.done ? `"${task.title}" moved back to pending` : `"${task.title}" completed 🎉`);
  }

  function saveTask(formData) {
    if (editingTask) {
      setTasks((previous) => previous.map((task) => (task.id === editingTask.id ? { ...task, ...formData } : task)));
      showToast('Changes saved');
    } else {
      const newTask = { ...formData, id: Date.now().toString(), done: false };
      setTasks((previous) => [...previous, newTask]);
      showToast('Task added');
    }
    goBack();
  }

  function deleteTask(taskId) {
    const index = tasks.findIndex((task) => task.id === taskId);
    const deleted = tasks[index];

    goBack();
    setTasks((previous) => previous.filter((task) => task.id !== taskId));
    showToast('Task deleted', 'Undo', () => {
      // Put the task back at its original position.
      setTasks((previous) => [...previous.slice(0, index), deleted, ...previous.slice(index)]);
      setToast(null);
    });
  }

  // ---- Conditional rendering: pick the view to show ----
  function renderView() {
    if (currentView === 'list') {
      return (
        <TaskListScreen
          tasks={tasks}
          filters={listFilters}
          onChangeFilters={setListFilters}
          onBack={goBack}
          onOpenTask={openTask}
          onToggleDone={toggleDone}
          onAddTask={() => openForm()}
        />
      );
    }

    if (currentView === 'detail' && selectedTask) {
      return (
        <TaskDetailScreen
          task={selectedTask}
          tasks={tasks}
          onBack={goBack}
          onEdit={() => openForm(selectedTask.id)}
          onDelete={() => deleteTask(selectedTask.id)}
          onToggleDone={() => toggleDone(selectedTask.id)}
        />
      );
    }

    if (currentView === 'form') {
      return <TaskFormScreen task={editingTask} tasks={tasks} onCancel={goBack} onSave={saveTask} />;
    }

    return (
      <DashboardScreen
        tasks={tasks}
        onOpenList={openList}
        onOpenTask={openTask}
        onAddTask={() => openForm()}
        onToggleDone={toggleDone}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.app}>
        <StatusBar style="dark" />
        {renderView()}
        <Toast toast={toast} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: COLORS.background },
});
