module.exports = {
  success: (msg, data) => {
    const response = {};
    response.message = msg;
    response.data = data;

    return response;
  },
  error: (msg) => {
    const response = {};
    response.message = msg;

    return response;
  },
};
