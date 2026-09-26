import test from 'node:test';
import assert from 'node:assert/strict';
import { parseSnapshot, readSnapshot, writeSnapshot, resetSnapshot, STORAGE_KEY } from './case-storage.ts';

function memoryStorage() {
  const entries = new Map();
  return {
    getItem: key => entries.get(key) ?? null,
    setItem: (key, value) => entries.set(key, value),
    removeItem: key => entries.delete(key),
  };
}

const sample = {
  id:'ST-1',name:'Demo',year:'Year 9',form:'9H',manager:'Demo Manager',
  status:'On Track',stage:2,deadline:'Tomorrow',concern:'Example',
  context:'Example',voice:'Example',reporter:'Demo',reported:'Today',
  decision:'Awaiting decision',rationale:'',actions:[],
  acknowledgements:{School:false,Student:false,Family:false},
  checklist:{'Receiving teacher briefed':false},history:[],
};

test('fresh storage, validated roundtrip and revision increment', () => {
  const storage = memoryStorage();
  assert.equal(readSnapshot(storage), null);
  const first = writeSnapshot(storage, null, [sample]);
  assert.equal(first.revision, 1);
  assert.deepEqual(readSnapshot(storage), first);
  assert.equal(writeSnapshot(storage, first.revision, [sample]).revision, 2);
});

test('corruption and unsupported version are rejected, never overwritten by a write', () => {
  const storage = memoryStorage();
  for (const raw of ['{broken', '{"version":2,"revision":0,"cases":[]}', '{"version":1,"revision":0,"cases":[{}]}']) {
    storage.setItem(STORAGE_KEY, raw);
    assert.throws(() => writeSnapshot(storage, null, [sample]));
    assert.equal(storage.getItem(STORAGE_KEY), raw);
  }
  assert.throws(() => parseSnapshot('{"version":1,"revision":0,"cases":[]}'));
});

test('stale writes are blocked and explicit reset invalidates prior revision', () => {
  const storage = memoryStorage();
  const first = writeSnapshot(storage, null, [sample]);
  writeSnapshot(storage, first.revision, [sample]);
  assert.throws(() => writeSnapshot(storage, first.revision, [sample]), /older copy/);
  const reset = resetSnapshot(storage, [sample]);
  assert.ok(reset.revision > 2);
  assert.throws(() => writeSnapshot(storage, 2, [sample]), /older copy/);
});

test('explicit reset can replace corrupt data', () => {
  const storage = memoryStorage();
  storage.setItem(STORAGE_KEY, 'not json');
  assert.throws(() => readSnapshot(storage));
  const reset = resetSnapshot(storage, [sample]);
  assert.deepEqual(readSnapshot(storage), reset);
});