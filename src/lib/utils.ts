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

  return `${day} ${month} 1984`;
}

export function formatMotorName(motor: Motor) {
  return `${motor.brand} ${motor.model} ${motor.tahun}`
}

export function getGambar(name: string, idGambar?: string) {
  return idGambar ? `${BASE_PATH}/storage/fetch/${idGambar}` : `${BASE_PATH}/avatar?name=${name}`
}

export function formatPrice(price) {
  const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });
  return formatter.format(price);
}

export function formatFilterString(value) {
  if (value instanceof Date) 
    value = formatDateToLongDate(value)
  return String(value).toLowerCase()
}

export function matchesSearch(value: any, lowerSearch: string): boolean {
  if (value == null) return false;

  if (value instanceof Date)
    value = formatFilterString(value)

  if (typeof value === 'object') {
    return Object.values(value).some((nestedValue) =>
      matchesSearch(nestedValue, lowerSearch)
    );
  }

  return formatFilterString(value).includes(lowerSearch);
}

const translateTable = {
  "Diajukan": 'Submitted',
  "Tersedia": 'Available',
  "Disewa": 'Rented',
  "DalamPerbaikan": 'Under Repair',
  "TidakTersedia": 'Unavailable',
  "Dibuat": 'Created',
  "Berlangsung": 'In Progress',
  "Batal": 'Cancelled',
  "Selesai": 'Completed',  
  "BelumLunas": 'Unpaid',
  "Lunas": 'Paid',
  "Gagal": 'Failed',
  "MenungguKonfirmasi": "Waiting Confirmation",
  "TransferBank": "Bank Transfer",
  "KartuKredit": "Credit Card",
  "DompetDigital": "E-Wallet",
  "Tunai": "Cash"
};

export function translateEnum(
 value?: string
): string {
  return value ? translateTable[value] : "";
}
