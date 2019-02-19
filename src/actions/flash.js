export const updateFlash = (message, status) => ({
    type: 'UPDATE_FLASH',
    payload: {
        message,
        status,
    },
});
