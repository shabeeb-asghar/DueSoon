import { PALETTE } from '../constants';

// Picks dark or white text so labels stay readable on any background colour.
// Light colours (lime, aqua, platinum) get dark text; dark ones (shadow grey, coral) get white.
export function getContrastText(hex) {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000; // perceived brightness, 0-255
  return brightness > 150 ? PALETTE.shadowGrey : '#FFFFFF';
}
