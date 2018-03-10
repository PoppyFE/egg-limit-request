'use strict';

const mock = require('egg-mock');

describe('test/limit-request.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/limit-request-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, limitRequest')
      .expect(200);
  });
});
