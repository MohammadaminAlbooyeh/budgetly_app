import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function schedulePaymentNotification({
  id,
  title,
  body,
  date,
}: {
  id: string;
  title: string;
  body: string;
  date: Date;
}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: date,
    identifier: id,
  });
}

export async function cancelPaymentNotification(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}

// Helper to calculate next notification date based on frequency
export function getNextOccurrence(startDate: string, frequency: string): Date {
  const date = new Date(startDate);
  switch (frequency) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      break;
  }
  return date;
}
