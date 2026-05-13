export const sendError = (res, status, message) => {
    return res.status(status).json({ success: false, message });
};

export const sendSuccess = (res, payload = {}) => {
    return res.json({ success: true, ...payload });
};
