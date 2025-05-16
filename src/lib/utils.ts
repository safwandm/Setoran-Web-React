import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDateToLongDate(date: Date) {
  if (!date)
    return "";
  
  const day = date.getUTCDate();
  const month = date.toLocaleString('en-GB', {
  month: 'long',
  timeZone: 'UTC'
  });
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
}