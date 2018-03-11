'use strict';

/**
 * egg-limit-request default config
 * @member Config#limitRequest
 * @property {String} SOME_KEY - some description
 */
exports.limitRequest = {
  limitTime: '5m',
  ipEnable: true,
  userIdEnable: true,
  deviceIdEnable: true,
  errorMsg: undefined,
};
