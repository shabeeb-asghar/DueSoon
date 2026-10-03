# DueSoon: Deadline & Workload Planner

A React Native (Expo) app that puts every quiz, assignment, project and exam from all your courses in one place, and **warns you about crunch weeks before you reach them**.

## The problem

Flex and Google Classroom show deadlines one course at a time. There's no single list across all courses and nothing tells you that five things are due in the same week. Students usually find out about a crunch week when they're already in it.

## The solution

DueSoon collects all deadlines, asks for a rough **effort estimate** (hours) for each one, and uses those estimates to:

- **detect crunch weeks**: any week where pending work adds up to more than `HEAVY_WEEK_HOURS` (12 h) gets flagged, and the app names the biggest task to start early;
- **suggest a start date** for each task (due date − hours ÷ `HOURS_PER_DAY`);
- **preview the impact while you add a task**: the form tells you, before you save, if the new task turns its week into a crunch week.

## Features

| Area | What it does |
|---|---|
| Dashboard | Overdue and crunch-week warnings (or an "all clear" message), 4 tappable stat cards, "Next up" list, 3 charts |
| Charts (`react-native-chart-kit`) | **Bar:** hours due per week, with crunch weeks in coral · **Pie:** pending hours by course · **Progress:** completion % per course |
| Task list | Search, status filter with live counts, course filter, sort by due date / priority / effort |
| Task detail | Countdown, start-date advice, crunch-week warning, mark done, edit, delete |
| Add / edit form | Inputs: `maxLength`, `keyboardType="decimal-pad"`, `multiline`, `autoCapitalize`, `returnKeyType`. Live validation and live workload preview |
| Feedback | Animated toast after every action, **Undo** for delete, colour-coded countdown badges |
| States | No tasks, no search matches, nothing pending, overdue, crunch / no crunch, invalid input, done / not done |

Validation rules: title is required (at least 3 characters and no duplicate in the same course), a course must be chosen, the due date can't be in the past (an overdue task that's being edited may keep its old date), and hours must be a number from 0.5 to 40.

## Colour scheme

Five-colour palette (`PALETTE` in `src/constants.js`), each with one job:

| Colour | Used for |
|---|---|
| Shadow Grey `#212738` | Text, primary buttons, selected chips, the + button |
| Vibrant Coral `#F97068` | Urgent / overdue / crunch weeks / high priority |
| Lemon Lime `#D1D646` | Due soon / warnings / medium priority, the toast's Undo text and the + icon |
| Sky Aqua `#57C4E5` | Safe / done / normal workload bars / low priority |
| Platinum `#EDF2EF` | App background |

Coral, lime and aqua are too light to read as text on white, so text uses darker shades of them (`dangerText`, `warningText`, `successText`). `getContrastText()` in `src/utils/colors.js` picks dark or white text for each chip or pill background.

## No navigation library

The assignment doesn't allow navigation libraries or side/bottom bars, so views are switched with **state and conditional rendering**. `App.js` keeps a `views` array (the last item is the current view). `showView()` pushes a view and `goBack()` pops one. `renderView()` decides which screen to render. The Android back button calls the same `goBack()`.

## Project structure

```
App.js                    State owner: tasks, current view, selected task, list filters, toast
src/
  constants.js            Thresholds, option lists, colours (change behaviour here)
  data/
    courses.js            Course objects (id, name, short, color)
    tasks.js              Seed tasks; dates are relative to today so the demo is always realistic
  utils/
    dates.js              Parse/format dates, countdown text, start of week
    tasks.js              getStatus, filterTasks, sortTasks, getSummary, getSuggestedStart
    workload.js           getWeeklyWorkload, getCrunchAdvice, chart data builders
    validation.js         validateTask(form, tasks, originalTask) -> { field: message }
  components/             Reusable UI: Header, Button, Chip, ChipGroup, TaskCard, CountdownBadge,
                          StatCard, Banner, ChartCard, EmptyState, FormField, DateStepper,
                          FloatingButton, Toast
  screens/                DashboardScreen, TaskListScreen, TaskDetailScreen, TaskFormScreen
```

**Design rule:** screens only render, all calculations live in `utils/`, and all state lives in `App.js` and is passed down as props. Events are passed down as callbacks (`onToggleDone`, `onSave`, ...).

## Where the React / JS concepts are

- **State:** `App.js` (`tasks`, `views`, `listFilters`, `toast`), `TaskFormScreen` (`form`, `submitted`)
- **Props and lifting state up:** list filters are owned by `App`, so they survive opening a task and coming back
- **Events:** `onPress`, `onChangeText`, `onSelect` callbacks
- **Conditional rendering:** `renderView()`, banners, empty states, error messages, the back button in `Header`
- **Array methods:** `filter` / `map` / `reduce` / `find` / `some` / `sort` / `slice` in `utils/` (for example, `getWeeklyWorkload` groups and totals tasks per week)
- **Immutable updates:** `map` for toggle/edit, `filter` for delete, spread for add/undo
- **Hooks:** `useState`, `useEffect` (toast timer, Android back button), `useRef` (`Animated.Value`), `useWindowDimensions` (chart width)

## Common changes

| Change | Where |
|---|---|
| Crunch-week threshold | `HEAVY_WEEK_HOURS` in `src/constants.js` |
| Countdown colours | `URGENT_DAYS`, `SOON_DAYS` in `src/constants.js` |
| Add a course | Add an object to `src/data/courses.js` (it appears in the form, the filters and the charts) |
| Add a task | Add an object to `src/data/tasks.js` |
| Default sort / sort logic | `sortKey` in `DEFAULT_FILTERS` (`App.js`), `comparators` in `src/utils/tasks.js` |
| Show only high-priority tasks | Add a condition in `filterTasks` (`src/utils/tasks.js`) |
| Test the empty states | Set `INITIAL_TASKS` to `[]`, or mark everything done |
| Number of "Next up" items | `NEXT_UP_COUNT` in `DashboardScreen.js` |

## Setup and run

Requires Node 18+ and the **Expo Go** app on your phone (Expo SDK 57).

```bash
cd DueSoon
npm install
npx expo start
```

Then scan the QR code with Expo Go (Android) or the Camera app (iOS). Press `w` to run it in a browser, or `a` for an Android emulator.

Dependencies: `react-native-chart-kit`, `react-native-svg` (needed by the charts), `react-native-safe-area-context`, and the web support packages.

## How AI was used

- **Ideation:** compared several problem ideas against the rubric. Marks/attendance tracking was rejected because Flex already does it. A cross-course workload planner fills a real gap.
- **Code generation:** an AI agent produced the first version of the structure, utils and components.
- **Review and testing:** the app was run on web and checked with an automated browser script covering filters, search, sort, validation, add, delete and undo. That testing found real bugs, which were then fixed:
  - horizontal chip rows were stretching and then collapsing, because a horizontal `ScrollView` has `flexGrow: 1` / `flexShrink: 1` by default; fixed with `flexGrow: 0, flexShrink: 0`;
  - list filters reset every time you opened a task and came back; fixed by lifting the filter state up into `App`.
- **Decisions made deliberately:**
  - a custom `DateStepper` instead of a native date picker, so it works the same in Expo Go, Snack and web with no extra native module;
  - no navigation library, because the assignment forbids one;
  - seed dates are relative to today, so the dashboard never shows stale data during a demo.
