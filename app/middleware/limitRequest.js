'use strict';

const ms = require('ms');
const URL = require('url');

module.exports = (options) => {
  const limitTime = options.limitTime ? ms(options.limitTime) || 1000;
  const prefix = options.prefix || 'limit';

  return async function(ctx, next) {
    const { logger } = ctx;
    const { redis, config } = ctx.app;
    if (!redis) {
      logger.warn('没有redis');
      await next();
      return;
    }

    let ipAddress = '';
    if (config.limitRequest.ipEnable) {
      if (options.hasOwnProperty('ipEnable') && options.ipEnable) {
        ipAddress = (ctx.ips && ctx.ips.length ? ctx.ips.join('-') : undefined) || ctx.ip || '';
      }
    }

    let userId = '';
    if (config.limitRequest.userIdEnable) {
      if (options.hasOwnProperty('userIdEnable') && options.userIdEnable) {
        let userIdFn = options.userIdFn || config.limitRequest.userIdFn;

        if (typeof userIdFn === 'function') {
          userId = userIdFn(ctx) || '';
        } else {
          userId = (request.accessData ? request.accessData.id : '') ||
            (request.authData ? request.authData.id : '') ||
            query.user_name ||
            (request.body ? request.body.user_name : '');
        }
      }
    }

    let deviceId = '';
    if (config.limitRequest.deviceIdEnable) {
      if (options.hasOwnProperty('deviceIdEnable') && options.deviceIdEnable) {
        deviceId = request.headers['device-uuid'] || '';
      }
    }

    const redisKey = `${prefix}:${ipAddress}:${deviceId}:${userId}:${request.method}:${request.path}`;

    const lastTime = yield redis.get(redisKey);
    const currentTime = new Date().getTime();
    if ((currentTime - lastTime) < limitTime) {
      logger.info(`校验 ${redisKey} 请求, 被限频不通过`);
      this.formatFailResp({errCode: 'F429', msg: options.errorMsg || config.limitRequest.errorMsg });
      return;
    }

    await redis.set(redisKey, currentTime, 'EX', limitTime * 0.001);

    await next();
  };
};
