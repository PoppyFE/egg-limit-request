'use strict';

const ms = require('ms');
const crypto = require('crypto');

module.exports = (options = {}) => {
  return async function(ctx, next) {
    const prefix = ctx.app.config.limitRequest.redisPrefix || 'limit';
    const limitTime = ms(options.limitTime || ctx.app.config.limitRequest.limitTime || '5m');

    const { logger, request } = ctx;
    const { redis, config } = ctx.app;
    if (!redis) {
      logger.warn('没有redis');
      await next();
      return;
    }

    let ipAddress = '';
    if (config.limitRequest.ipEnable) {
      if (!options.hasOwnProperty('ipEnable') || options.ipEnable) {
        ipAddress = (ctx.ips && ctx.ips.length ? ctx.ips.join('-') : undefined) || ctx.ip || '';
      }
    }

    let userId = '';
    if (config.limitRequest.userIdEnable) {
      if (!options.hasOwnProperty('userIdEnable') || options.userIdEnable) {
        const userIdProp = options.userId || config.limitRequest.userId;
        if (typeof userIdProp === 'function') {
          userId = userIdProp(ctx) || '';
        } else if (userIdProp === 'accessData') {
          userId = (request.accessData ? request.accessData.id : '');
        } else if (userIdProp === 'authData') {
          userId = request.authData ? request.authData.id : '';
        } else if (typeof userIdProp === 'string') {
          userId = request.query[userIdProp] || request.body[userIdProp] || '';
        }
      }
    }

    let deviceId = '';
    if (config.limitRequest.deviceIdEnable) {
      if (!options.hasOwnProperty('deviceIdEnable') || options.deviceIdEnable) {
        deviceId = request.headers['device-uuid'] || '';
      }
    }

    const limitContent = `${ipAddress}:${deviceId}:${userId}:${request.method}:${request.path}`;
    const hashLimitContent = crypto.createHash('md5').update(limitContent).digest('hex');

    const redisKey = `${prefix}:${hashLimitContent}`;

    const lastTime = await redis.get(redisKey);
    const currentTime = new Date().getTime();
    const timePassed = currentTime - lastTime;
    if (timePassed < limitTime) {
      logger.info(`校验 ${redisKey} 请求, 被限频不通过 limitTime: ${limitTime} timePassed: ${timePassed} limitContent: ${limitContent}`);
      ctx.formatFailResp({ errCode: 'F429', msg: options.errorMsg || config.limitRequest.errorMsg });
      return;
    }

    await redis.set(redisKey, currentTime, 'EX', limitTime * 0.001);

    await next();
  };
};
