import {
  SET_GREEN_ITEMS,
  SET_YELLOW_ITEMS,
  SET_RED_ITEMS,
  MOVE_ITEM,
  RESOLVE_ITEM,
  INIT,
} from "./actions";

const reducer = (state, { payload, type }) => {
  switch (type) {
    case SET_GREEN_ITEMS:
      return {
        ...state,
        greenItems: payload,
      };
    case SET_YELLOW_ITEMS:
      return {
        ...state,
        yellowItems: payload,
      };
    case SET_RED_ITEMS:
      return {
        ...state,
        redItems: payload,
      };
    case MOVE_ITEM:
      let moved = { ...state.moved, [payload.id]: true };
      return {
        ...state,
        redItems: state.redItems?.filter(
          (item) =>
            (!moved || !moved[item.id]) &&
            (!state.resolved || !state.resolved[item.id])
        ),
        yellowItems: state.yellowItems?.filter(
          (item) =>
            (!moved || !moved[item.id]) &&
            (!state.resolved || !state.resolved[item.id])
        ),
        moved,
      };
    case RESOLVE_ITEM:
      let resolved = { ...state.resolved, [payload.id]: true };
      return {
        ...state,
        redItems: state.redItems?.filter(
          (item) =>
            (!state.moved || !state.moved[item.id]) &&
            (!resolved || !resolved[item.id])
        ),
        yellowItems: state.yellowItems?.filter(
          (item) =>
            (!state.moved || !state.moved[item.id]) &&
            (!resolved || !resolved[item.id])
        ),
        resolved,
      };
    case INIT:
      return payload;
    default:
      throw new Error(`No such action: ${type}`);
  }
};

export default reducer;
