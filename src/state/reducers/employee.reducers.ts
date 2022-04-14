import { ResponsesAction } from "../actions/responses.action";
import { Method, response, Result } from "../actions-types/responses.types";

const initialState: response = {
  getResult: {} as Result,
  postResult: {} as Result,
  updateResult: {} as Result,
  deleteResult: {} as Result,
};

const employeeReducers = (state = initialState, action: ResponsesAction) => {
  switch (action.type) {
    case Method.GET:
      return {
        ...state,
        getResult: action.payload.getResult,
      };
    case Method.POST:
      return {
        ...state,
        postResult: action.payload.postResult,
      };
    case Method.DELETE:
      return {
        ...state,
        deleteResult: action.payload.deleteResult,
      };

    case Method.UPDATE:
      return {
        ...state,
        updateResult: action.payload.updateResult,
      };
    case Method.RESET:
      return {
        ...initialState,
      };
    default:
      return state;
  }
};

export default employeeReducers;
