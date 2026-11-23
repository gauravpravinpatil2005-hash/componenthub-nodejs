const test = require('node:test');
const assert = require('node:assert');
const { validateRequest } = require('../utils/validators');

const today = new Date(2026, 10, 23); // Mon 23 Nov 2026 (fixed for repeatable tests)
const valid = {
  name: 'Gaurav Pravin Patil', prn: '202401100049', email: 'gaurav@example.com',
  department: 'E&TC', category: 'Microcontroller', componentName: 'Arduino Uno R3',
  quantity: 2, labDate: '2026-11-25', purpose: 'Needed for the embedded systems mini project.'
};
const check = (patch) => validateRequest({ ...valid, ...patch }, today);

test('valid submission passes', () => assert.strictEqual(check({}).valid, true));
test('empty name', () => assert.ok(check({ name: '' }).errors.name));
test('invalid name (digits)', () => assert.ok(check({ name: 'Gaurav123' }).errors.name));
test('empty PRN', () => assert.ok(check({ prn: '' }).errors.prn));
test('short PRN', () => assert.ok(check({ prn: '2024011' }).errors.prn));
test('invalid email', () => assert.ok(check({ email: 'gaurav@' }).errors.email));
test('missing department', () => assert.ok(check({ department: '' }).errors.department));
test('missing category', () => assert.ok(check({ category: '' }).errors.category));
test('unknown category', () => assert.ok(check({ category: 'Weapons' }).errors.category));
test('quantity zero', () => assert.ok(check({ quantity: 0 }).errors.quantity));
test('quantity above 10', () => assert.ok(check({ quantity: 11 }).errors.quantity));
test('quantity decimal', () => assert.ok(check({ quantity: 2.5 }).errors.quantity));
test('past date', () => assert.ok(check({ labDate: '2026-11-20' }).errors.labDate));
test('Sunday date', () => assert.ok(check({ labDate: '2026-11-29' }).errors.labDate));
test('date beyond 30 days', () => assert.ok(check({ labDate: '2027-02-01' }).errors.labDate));
test('fake date 31 Feb', () => assert.ok(check({ labDate: '2026-02-31' }).errors.labDate));
test('short purpose', () => assert.ok(check({ purpose: 'for lab' }).errors.purpose));
test('bulk quantity needs detailed purpose', () =>
  assert.ok(check({ quantity: 8, purpose: 'Needed for embedded project work.' }).errors.purpose));
test('bulk quantity with detailed purpose passes', () =>
  assert.strictEqual(check({ quantity: 8, purpose: 'Needed for a group embedded systems project with eight sensor nodes in the lab.' }).valid, true));
test('missing body', () => assert.strictEqual(validateRequest(undefined, today).valid, false));
