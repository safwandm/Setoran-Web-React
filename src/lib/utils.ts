import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Motor } from "./api-client";
import { BASE_PATH } from "./api-client/wrapper";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDateToLongDate(date: Date | undefined | null) {
  if (!date || date.getFullYear() === 1)
    return "-";
  
  const day = date.getUTCDate();
  const month = date.toLocaleString('en-GB', {
  month: 'long',
  timeZone: 'UTC'
  });
  const year = date.getUTCFullYear();

  return `${day} ${month} ${year}`;
}

export function formatMotorName(motor: Motor) {
  return `${motor.brand} ${motor.model} ${motor.tahun}`
}

export function getGambar(name: string, idGambar?: string) {
  return idGambar ? `${BASE_PATH}/storage/fetch/${idGambar}` : `${BASE_PATH}/avatar?name=${name}`
}