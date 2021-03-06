
export enum STATES {
    DEFAULT = "DEFAULT",
    ADD_WMS_SERVICE = "ADD_WMS_SERVICE",
    ADD_VECTOR_SERVICE = "ADD_VECTOR_SERVICE",
}

export const UI_STATE = "UI_STATE";

export interface IUIStateAction {
    type: string;
    state: string;
}

export const setUIState = (state: any): IUIStateAction => ({type: UI_STATE, state});
