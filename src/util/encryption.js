import CryptoJS from 'crypto-js';
import constant from './constant';
import SparkMD5 from 'spark-md5';

const SALT = constant.ENCRPY_SALT;

export default {
  // AES加密
  // ase主要是将存在localStorage的用户信息和商户信息加密解密
  aes: {
    encrypt (data) {
      var ENCRPY_SALT = CryptoJS.MD5(SALT).toString();
      let key = CryptoJS.enc.Utf8.parse(ENCRPY_SALT);
      let secretData = CryptoJS.enc.Utf8.parse(data);
      let encrypted = CryptoJS.AES.encrypt(
        secretData,
        key,
        {
          iv: CryptoJS.enc.Utf8.parse(ENCRPY_SALT),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );
      return encrypted.toString();
    },

    // 解密
    decrypt (data) {
      var ENCRPY_SALT = CryptoJS.MD5(SALT).toString();
      let key = CryptoJS.enc.Utf8.parse(ENCRPY_SALT);
      let decrypt = CryptoJS.AES.decrypt(
        data,
        key,
        {
          iv: CryptoJS.enc.Utf8.parse(ENCRPY_SALT),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });
      return CryptoJS.enc.Utf8.stringify(decrypt).toString();
    }
  },
  // md5主要是对密码和上传的md5文件进行加密解密
  md5: {
    encrypt (data) {
      // 直接对密码进行md5加密
      data = CryptoJS.MD5(data).toString();
      return data;
    },
    fileMd5 (file, callBack) {
      //   file 选取的文件
      //   callBack 回调函数可以返回获取的MD5
      // eslint-disable-next-line one-var
      var fileReader = new FileReader(),
        blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice,
        chunkSize = 2097152,
        // read in chunks of 2MB
        chunks = Math.ceil(file.size / chunkSize),
        currentChunk = 0,
        spark = new SparkMD5();

      fileReader.onload = function (e) {
        spark.appendBinary(e.target.result); // append binary string
        currentChunk++;
        if (currentChunk < chunks) {
          loadNext();
        } else {
          callBack(spark.end());
        }
      };

      function loadNext () {
        // eslint-disable-next-line one-var
        var start = currentChunk * chunkSize,
          end = start + chunkSize >= file.size ? file.size : start + chunkSize;

        fileReader.readAsBinaryString(blobSlice.call(file, start, end));
      };
      loadNext();
    }
  }

};
