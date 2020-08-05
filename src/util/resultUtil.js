import constant from './constant';

const success = (code, data, message) => {
  return {
    isSuccess: true,
    code: code,
    data: data,
    message: message
  };
};

const error = (code, message) => {
  return {
    isSuccess: false,
    code: code,
    message: message
  };
};

// common method
const process = (response, code, errorMessage) => {
  console.log('网络请求response对象');
  console.log(response);
  var result = null;
  if (response.status === constant.OK_CODE) {
    result = response.data;
  } else {
    result = error(code, result.message ? result.message : errorMessage);
  }
  return result;
};

export default {
  success,
  error,
  process
};
