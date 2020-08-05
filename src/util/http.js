// import Vue from 'vue';
import axios from 'axios';
import constant from './constant';

var get = (url, params, headers = { 'Content-Type': 'application/json' }) => {
  headers = processHeader(headers);
  params = processParam(params);
  url = constant.BASE_URL[constant.ACTIVE] + '/' + url;
  // TODO URL combination
  var request = axios({
    method: 'get',
    url: url,
    params: params,
    headers: headers
  });
  return request;
};

var post = (url, data, params, headers = { 'Content-Type': 'application/json' }) => {
  headers = processHeader(headers);
  params = processParam(params);

  url = constant.BASE_URL[constant.ACTIVE] + '/' + url;
  // TODO URL combination
  var request = axios({
    method: 'post',
    url: url,
    params: params,
    data: data,
    headers: headers

  });
  return request;
};

var put = (url, data, params, headers = { 'Content-Type': 'application/json' }) => {
  headers = processHeader(headers);
  params = processParam(params);
  url = constant.BASE_URL[constant.ACTIVE] + '/' + url;
  // TODO URL combination
  var request = axios({
    method: 'put',
    url: url,
    params: params,
    data: data,
    headers: headers
  });
  return request;
};

var del = (url, params, headers = { 'Content-Type': 'application/json' }) => {
  headers = processHeader(headers);
  params = processParam(params);
  url = constant.BASE_URL[constant.ACTIVE] + '/' + url;
  // TODO URL combination
  var request = axios({
    method: 'delete',
    url: url,
    params: params,
    headers: headers
  });
  return request;
};

function processHeader (headers) {
  var contentType = 'Content-Type';
  if (!headers.hasOwnProperty(contentType)) {
    headers[contentType] = 'application/json';
  }
  // TODO maybe have more default setting
  return headers;
}

function processParam (params) {
  var result = {};
  for (let key in params) {
    if (params[key]) {
      result[key] = params[key];
    }
  }
  return result;
}

export default {
  get,
  post,
  put,
  del
};
