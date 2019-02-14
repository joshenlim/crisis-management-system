const INITIAL_STATE = {
  show: true,
};

export default function header(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'HIDE_HEADER':
      return {
        ...state,
        show: false,
      };
    default:
      return state;
  }
}
