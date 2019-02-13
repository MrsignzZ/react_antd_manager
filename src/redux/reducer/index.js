/**
 * Reducer 数据处理
 */
import { type } from "../action";

export default (state, action) => {
  switch (action.type) {
    case type.SWITCH_MENU:
      return {
        ...state,
        menuName: action.menuName
      }
      break;

    default:
      return { ...state };
  }
}