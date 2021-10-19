export interface TreatmentUnit {
  id: string,
  caregivers_names: Array<string>,
  is_send_alarm_notification_active: boolean,
  location: string,
  name: string,
  number_of_active_alarms: number,
  number_of_devices: number,
}