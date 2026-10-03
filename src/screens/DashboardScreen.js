import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { BarChart, PieChart, ProgressChart } from 'react-native-chart-kit';
import Banner from '../components/Banner';
import Button from '../components/Button';
import ChartCard from '../components/ChartCard';
import EmptyState from '../components/EmptyState';
import FloatingButton from '../components/FloatingButton';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import { COLORS, HEAVY_WEEK_HOURS } from '../constants';
import { formatLong, toISO, today } from '../utils/dates';
import { getSummary, sortTasks } from '../utils/tasks';
import { getCompletionByCourse, getCrunchAdvice, getPendingHoursByCourse, getWeeklyWorkload } from '../utils/workload';

const chartConfig = {
  backgroundGradientFrom: COLORS.card,
  backgroundGradientTo: COLORS.card,
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(33, 39, 56, ${opacity})`, // shadow grey
  labelColor: (opacity = 1) => `rgba(95, 100, 117, ${opacity})`,
  barPercentage: 0.7,
  propsForBackgroundLines: { stroke: COLORS.border, strokeDasharray: '' },
};

const NEXT_UP_COUNT = 3;

export default function DashboardScreen({ tasks, onOpenList, onOpenTask, onAddTask, onToggleDone }) {
  const { width } = useWindowDimensions();
  const chartWidth = width - 34; // screen padding (16 * 2) + card border

  if (tasks.length === 0) {
    return (
      <View style={styles.screen}>
        <Header title="DueSoon" subtitle={formatLong(toISO(today()))} />
        <EmptyState
          emoji="📭"
          title="No tasks yet"
          message="Add your quizzes, assignments and exams to see your workload."
          actionLabel="Add your first task"
          onAction={onAddTask}
        />
      </View>
    );
  }

  const summary = getSummary(tasks);
  const crunch = getCrunchAdvice(tasks);
  const weeks = getWeeklyWorkload(tasks);
  const pendingByCourse = getPendingHoursByCourse(tasks);
  const completion = getCompletionByCourse(tasks);
  const nextUp = sortTasks(tasks.filter((task) => !task.done), 'due').slice(0, NEXT_UP_COUNT);
  const pendingCount = tasks.length - summary.done;

  return (
    <View style={styles.screen}>
      <Header
        title="DueSoon"
        subtitle={`${formatLong(toISO(today()))} · ${pendingCount} pending`}
        rightLabel="All tasks"
        onRightPress={() => onOpenList('all')}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Dynamic warnings: only rendered when the data calls for them */}
        {summary.overdue > 0 && (
          <Banner
            type="danger"
            message={`You have ${summary.overdue} overdue ${summary.overdue === 1 ? 'task' : 'tasks'}.`}
            actionLabel="View"
            onAction={() => onOpenList('overdue')}
          />
        )}
        {crunch ? (
          <Banner type="warning" message={crunch.message} actionLabel="Open" onAction={() => onOpenTask(crunch.task.id)} />
        ) : (
          <Banner type="success" message={`No crunch weeks ahead. Every week is under ${HEAVY_WEEK_HOURS} hrs.`} />
        )}

        <View style={styles.stats}>
          <StatCard label="Due today" value={summary.dueToday} color={COLORS.dangerText} onPress={() => onOpenList('pending')} />
          <StatCard label="Due in 7 days" value={summary.dueThisWeek} color={COLORS.warningText} onPress={() => onOpenList('pending')} />
          <StatCard label="Overdue" value={summary.overdue} color={COLORS.dangerText} onPress={() => onOpenList('overdue')} />
          <StatCard label="Completed" value={summary.done} color={COLORS.successText} onPress={() => onOpenList('done')} />
        </View>

        <Text style={styles.section}>Next up</Text>
        {nextUp.length === 0 ? (
          <EmptyState emoji="🎉" title="Nothing pending" message="You're all caught up. Enjoy the break!" />
        ) : (
          nextUp.map((task) => (
            <TaskCard key={task.id} task={task} onPress={() => onOpenTask(task.id)} onToggleDone={() => onToggleDone(task.id)} />
          ))
        )}

        <Text style={styles.section}>Workload</Text>

        <ChartCard title="Hours due per week" subtitle={`Coral bars are crunch weeks (over ${HEAVY_WEEK_HOURS} hrs)`}>
          <BarChart
            data={{
              labels: weeks.map((week) => week.label),
              datasets: [
                {
                  data: weeks.map((week) => week.hours),
                  colors: weeks.map((week) => () => (week.isHeavy ? COLORS.danger : COLORS.success)),
                },
              ],
            }}
            width={chartWidth}
            height={200}
            chartConfig={chartConfig}
            yAxisSuffix="h"
            yAxisLabel=""
            fromZero
            showValuesOnTopOfBars
            withCustomBarColorFromData
            flatColor
          />
        </ChartCard>

        <ChartCard title="Pending hours by course" subtitle="Where your remaining effort is going">
          {pendingByCourse.length === 0 ? (
            <EmptyState emoji="🧘" title="No pending work" />
          ) : (
            <PieChart
              data={pendingByCourse.map((item) => ({
                name: `hrs · ${item.course.short}`,
                hours: item.hours,
                color: item.course.color,
                legendFontColor: COLORS.text,
                legendFontSize: 12,
              }))}
              width={chartWidth}
              height={180}
              chartConfig={chartConfig}
              accessor="hours"
              backgroundColor="transparent"
              paddingLeft="12"
              absolute
            />
          )}
        </ChartCard>

        <ChartCard title="Completion by course" subtitle="Share of each course's tasks marked done">
          <ProgressChart
            data={{
              labels: completion.map((item) => item.course.short),
              data: completion.map((item) => item.ratio),
              colors: completion.map((item) => item.course.color),
            }}
            width={chartWidth}
            height={200}
            strokeWidth={9}
            radius={26}
            chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(140, 147, 168, ${opacity})` }}
            withCustomBarColorFromData
          />
        </ChartCard>

        <Button label="See all tasks" variant="secondary" onPress={() => onOpenList('all')} />
      </ScrollView>

      <FloatingButton onPress={onAddTask} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 110 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  section: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginTop: 8, marginBottom: 10 },
});
