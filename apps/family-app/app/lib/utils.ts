import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertTo12Hour(time24: number): string {
  // Convert number to string and pad with leading zeros if necessary
  const timeString = time24.toString().padStart(4, "0");

  // Extract hours and minutes from the string
  const hours24 = parseInt(timeString.slice(0, 2), 10);
  const minutes = timeString.slice(2);

  // Determine AM/PM period
  const period = hours24 >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  const hours12 = hours24 % 12 || 12;

  // Return formatted time string
  return `${hours12}:${minutes} ${period}`;
}
