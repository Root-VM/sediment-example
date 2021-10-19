export interface TreatmentUnitDetail {
  id: string;
  caregivers_names: Array<string>;
  active_alarms: Array<{
    id: string;
    device_id: string;
    timestamp: string;
  }>;
  devices: Array<{
    activity_intensity_graph_enabled: boolean;
    description: string;
    id: string
  }>;

  is_send_alarm_notification_active: boolean;
  location: string;
  name: string;
  number_of_active_alarms: number;
  number_of_devices: number;
}