
var phoneValidator = (rule, phone, callback) => {
  var myreg = new RegExp('^[1][3,4,5,7,8][0-9]{9}$');
  if (!myreg.test(phone)) {
    return callback(new Error(rule.message));
  }
  callback();
};

var emailValidator = (rule, email, callback) => {
  var myreg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$');
  if (!myreg.test(email)) {
    return callback(new Error(rule.message));
  }
  callback();
};

export default {
  phoneValidator, emailValidator
};
