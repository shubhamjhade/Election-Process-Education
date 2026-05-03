'use strict';
const { structuredLog } = require('../utils/logger');

describe('Logger', () => {
  it('outputs structured JSON with severity and message', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    structuredLog('info', 'test message', { key: 'value' });
    expect(spy).toHaveBeenCalledTimes(1);
    const output = JSON.parse(spy.mock.calls[0][0]);
    expect(output.severity).toBe('INFO');
    expect(output.message).toBe('test message');
    expect(output.key).toBe('value');
    expect(output.timestamp).toBeDefined();
    spy.mockRestore();
  });
});
