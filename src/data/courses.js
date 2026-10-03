import { PALETTE } from '../constants';

// Static course data. Add an object here and it appears in the form,
// the course filter and all dashboard charts automatically.
export const COURSES = [
  { id: 'CS2001', name: 'Data Structures', short: 'DS', color: PALETTE.shadowGrey },
  { id: 'CS2005', name: 'Database Systems', short: 'DB', color: PALETTE.skyAqua },
  { id: 'CS3002', name: 'Software for Mobile Devices', short: 'SMD', color: PALETTE.vibrantCoral },
  { id: 'MT2005', name: 'Probability & Statistics', short: 'Stats', color: PALETTE.lemonLime },
  { id: 'SS1007', name: 'Technical Writing', short: 'TW', color: '#8C93A8' }, // lighter shade of shadow grey
];

export function findCourse(courseId) {
  return COURSES.find((course) => course.id === courseId);
}
