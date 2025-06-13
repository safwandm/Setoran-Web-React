// import test, { describe } from 'node:test';

import {describe, expect, jest, test} from '@jest/globals'

import { cn, formatDateToLongDate, formatMotorName, getGambar, formatPrice, formatFilterString, matchesSearch, translateEnum } from '../src/lib/utils'; // adjust path as needed


describe('Utility functions', () => {


  test('formatDateToLongDate() returns "-" for undefined/null/invalid', () => {
    expect(formatDateToLongDate(undefined)).toBe("-");
    expect(formatDateToLongDate(null)).toBe("-");
    expect(formatDateToLongDate(new Date(1))).toBe("-");
  });

  test('formatDateToLongDate() formats a valid date', () => {
    const date = new Date(Date.UTC(2025, 5, 13)); // 13 June 2025
    expect(formatDateToLongDate(date)).toBe('13 June 2025');
  });


});
 