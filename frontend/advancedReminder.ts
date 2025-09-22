import { schedulePaymentNotification } from './notifications';

// Calculate reminder times for a payment
export function getReminderDates(startDate: string, frequency: string, reminders: Array<{days: number, hours: number}>, count: number = 5): Date[] {
  const dates: Date[] = [];
  let baseDate = new Date(startDate);
  for (let i = 0; i < count; i++) {
    reminders.forEach(rem => {
      const reminderDate = new Date(baseDate);
      reminderDate.setDate(reminderDate.getDate() - (rem.days || 0));
      reminderDate.setHours(reminderDate.getHours() - (rem.hours || 0));
      dates.push(new Date(reminderDate));
    });
    // Advance baseDate by frequency
    switch (frequency) {
      case 'daily':
        baseDate.setDate(baseDate.getDate() + 1);
        break;
      case 'weekly':
        baseDate.setDate(baseDate.getDate() + 7);
        break;
      case 'monthly':
        baseDate.setMonth(baseDate.getMonth() + 1);
        break;
      case 'yearly':
        baseDate.setFullYear(baseDate.getFullYear() + 1);
        break;
      default:
        break;
    }
  }
  return dates;
}

// Schedule all reminders for a payment
export async function scheduleAllReminders(payment: {
  id: number;
  type: string;
  category: string;
  value: number;
  start_date: string;
  frequency: string;
  note: string;
  reminders: Array<{days: number, hours: number}>;
}) {
  const reminderDates = getReminderDates(payment.start_date, payment.frequency, payment.reminders);
  for (let i = 0; i < reminderDates.length; i++) {
    await schedulePaymentNotification({
      id: `${payment.id}_${i}`,
      title: `Upcoming ${payment.type}`,
      body: `${payment.category}: ${payment.value} due on ${payment.start_date}`,
      date: reminderDates[i],
    });
  }
}
