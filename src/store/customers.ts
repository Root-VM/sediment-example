import { RematchDispatch } from "@rematch/core";
import { Customer } from "../interfaces/customer";
import { request } from "../api/api";
import { TreatmentUnit } from "../interfaces/treatmentUnit";
import { TreatmentUnitDetail } from "../interfaces/treatmentUnitDetail";
import { MissedAlarm } from "../interfaces/missed-alarm";

type State = {
  list: Array<Customer>;
  treatmentUnits: Array<TreatmentUnit>;
  treatmentUnitDetail: TreatmentUnitDetail;
  devicesStatus: Array<any>;
};

const treatmentUnitDetailDefault: TreatmentUnitDetail = {
  id: "",
  caregivers_names: [""],
  active_alarms: [],
  devices: [
    {
      activity_intensity_graph_enabled: false,
      description: "",
      id: "",
    },
  ],
  is_send_alarm_notification_active: false,
  location: "",
  name: "",
  number_of_active_alarms: 0,
  number_of_devices: 0,
};

const model = {
  state: {
    list: [],
    treatmentUnits: [],
    treatmentUnitDetail: treatmentUnitDetailDefault,
    devicesStatus: [],
  },
  reducers: {
    setCustomers: (state: State, payload: Array<Customer>) => {
      return { ...state, list: payload };
    },
    setTreatmentUnits: (state: State, payload: Array<TreatmentUnit>) => {
      return { ...state, treatmentUnits: payload };
    },
    setTreatmentUnitDetail: (state: State, payload: TreatmentUnitDetail) => {
      return { ...state, treatmentUnitDetail: payload };
    },
    setDevicesStatus: (state: State, payload: Array<any>) => {
      return { ...state, devicesStatus: payload };
    },
  },
  effects: (dispatch: RematchDispatch<any>) => ({
    async getCustomers() {
      const result = await request({ url: "/customers/", method: "GET" });

      dispatch.customers.setCustomers(result);
    },

    async getTreatmentUnits(customerId: string) {
      const result = await request({
        url: `/customers/${customerId}/treatment_units/`,
        method: "GET",
      });

      result && result.length && dispatch.customers.setTreatmentUnits(result);
    },

    async removeTreatmentUnits() {
      dispatch.customers.setTreatmentUnits([]);
    },

    async getTreatmentUnit(customerId: string) {
      const result = await request({
        url: `/treatment_units/${customerId}/`,
        method: "GET",
      });

      dispatch.customers.setTreatmentUnitDetail(result);
    },

    async getAllClientsLocationData() {
      const customers = await request({ url: "/customers/", method: "GET" });

      if (customers?.length) {
        return await Promise.all(
          customers.map((data: any) => {
            return request({
              url: `/customers/${data.id}/treatment_units/`,
              method: "GET",
            });
          })
        );
      } else {
        return [];
      }
    },

    async postMissedAlarm(data: MissedAlarm) {
      const formData = new FormData();
      formData.append("reported_fall_time", String(data.reported_fall_time));
      formData.append("treatment_unit", data.treatment_unit);
      formData.append("description", data.description);

      return await request({
        url: `/fall_reports/`,
        method: "POST",
        body: formData,
      });
    },
    async switchTreatmentUnit(data: { id: string; value: boolean }) {
      const formData = new FormData();
      formData.append("is_send_alarm_notification_active ", String(data.value));

      return await request({
        url: `/treatment_units/${data.id}/`,
        method: "PUT",
        body: formData,
      });
    },
    async getTreatmentUnitsDeviceStatus(ids: Array<string>) {
      let query = "";

      for (let i in ids) {
        query += `${i === "0" ? "?" : "&"}treatment_unit_ids=${ids[i]}`;
      }

      const response = await request({
        url: `/devices/status/${query}`,
        method: "GET",
      });

      let result: Array<any> = [];

      if (Object.keys(response).length !== 0) {
        Object.entries(response).forEach((val, i) => {
          result.push({
            status: val[1],
            device_id: val[0],
            treatment_id: ids[i],
          });
        });
        dispatch.customers.setDevicesStatus(result);
      }
    },
  }),
};

export default model;
