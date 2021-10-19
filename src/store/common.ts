import { RematchDispatch } from "@rematch/core";

type State = {
  treatmentUnitsFilter: Array<{ id: string; value: string }>;
  stayLogin: boolean;
  viewType: "row" | "line";
  hideBackIconOnTreatmentList: boolean;
};

const model = {
  state: {
    stayLogin: false,
    treatmentUnitsFilter: [],
    viewType: "line",
    hideBackIconOnTreatmentList: false,
  },
  reducers: {
    setTreatmentFilter: (
      state: State,
      payload: { id: string; value: string }
    ) => {
      const value = state.treatmentUnitsFilter;
      const objIndex = value.findIndex((obj) => obj.id === payload.id);
      payload.value = payload.value ? payload.value : "";

      if (objIndex >= 0) {
        value[objIndex].value = payload.value;
      } else {
        value.push(payload);
      }

      return { ...state, treatmentUnitsFilter: value };
    },
    setLoginType: (state: State, payload: boolean) => {
      return { ...state, stayLogin: payload };
    },
    setViewType: (state: State, payload: boolean) => {
      return { ...state, viewType: payload };
    },
    setHideIcon: (state: State, payload: boolean) => {
      return { ...state, hideBackIconOnTreatmentList: payload };
    },
  },
  effects: (dispatch: RematchDispatch<any>) => ({
    saveFilters(data: { id: string; value: string }) {
      dispatch.common.setTreatmentFilter(data);
    },
    saveLoginType(data: boolean) {
      dispatch.common.setLoginType(data);
    },
    saveViewType(data: "row" | "line") {
      dispatch.common.setViewType(data);
    },
    hideBackIconOnTreatmentList(data: boolean) {
      dispatch.common.setHideIcon(data);
    },
  }),
};

export default model;
