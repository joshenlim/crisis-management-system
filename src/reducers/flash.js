const INITIAL_STATE = {
    message: null,
    status: null
  };
  
  export default function flash(state = INITIAL_STATE, action) {
    switch (action.type) {
      case 'UPDATE_FLASH':
        return {
          ...state,
          message: action.payload.message,
          status: action.payload.status,
        };
      default:
        return state;
    }
  }
  