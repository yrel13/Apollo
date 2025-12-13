export const parseApiError = (error) => {
    const resp = error?.response;
    const data = resp?.data || {};
    const message = data.message || error?.message || 'Request failed';
    const fieldErrors = data.errors && typeof data.errors === 'object' ? data.errors : {};
    return { message, fieldErrors };
};
