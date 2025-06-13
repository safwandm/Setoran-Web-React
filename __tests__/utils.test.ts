import {describe, expect, test} from '@jest/globals'

import { formatDateToLongDate, formatFilterString } from '../src/lib/utils'; // adjust path as needed


describe('Utility functions', () => {


  test('formatDateToLongDate() returns "-" for undefined/null', () => {
    expect(formatDateToLongDate(undefined)).toBe("-");
    expect(formatDateToLongDate(null)).toBe("-");
  });

  test('formatDateToLongDate() formats a valid date', () => {
    const date = new Date(Date.UTC(2025, 5, 13)); 
    expect(formatDateToLongDate(date)).toBe('13 June 2025');
  });

  test('formats Date object correctly using formatDateToLongDate', () => {
    const date = new Date(Date.UTC(2025, 5, 13)); 
    expect(formatFilterString(date)).toBe('13 june 2025'); 
  });

  test('converts number to string and lowercases it', () => {
    expect(formatFilterString(12345)).toBe('12345');
  });

  test('converts string to lowercase', () => {
    expect(formatFilterString('HeLLo WoRLd')).toBe('hello world');
  });
});
