import { test, before, after } from 'node:test';
import { createServer } from 'vite';
import assert from 'node:assert/strict';
import { getEquipmentRequirement, getEquipmentLabel, requiresQuoteEquipment, getQuoteEquipmentRequirement } from '../src/data/serviceCatalog.js';

let server, validate;
before(async () => {
  server = await createServer({ server: { middlewareMode: true, watch: null, hmr: false, ws: false }, appType: 'custom' });
  validate = (await server.ssrLoadModule('/src/services/quoteService.js')).validateQuoteForReview;
});
after(async () => { await server?.close(); });

test('A–H: review validation follows canonical requirement', () => {
  for (const [serviceId, machineId, blocked] of [
    ['scan', null, true], ['scan', 't-scan', false], ['dimensional', null, true],
    ['training', 'prismo', false], ['training', null, false],
    ['reverse-engineering', null, false], ['reverse-engineering', 'atos-q', false],
    ['asset-structure', null, false],
  ]) {
    const result = validate({ serviceId, machineId, status: 'Em elaboração', items: [], scope: 'Escopo' });
    assert.equal(result.issues.some(issue => issue.field === 'machineId'), blocked, serviceId);
  }
  assert.equal(getQuoteEquipmentRequirement({serviceId:'asset-structure',items:[{serviceId:'training'}]}), 'OPTIONAL');
});

test('canonical equipment requirements and null labels', () => {
  for (const id of ['dimensional','scan','internal']) assert.equal(getEquipmentRequirement(id), 'REQUIRED');
  for (const id of ['reverse-engineering','failure-analysis','digital-library','maintenance','training']) {
    assert.equal(getEquipmentRequirement(id), 'OPTIONAL');
    assert.equal(getEquipmentLabel(id, null), 'Sem equipamento específico');
  }
  assert.equal(getEquipmentRequirement('asset-structure'), 'NOT_APPLICABLE');
  assert.equal(getEquipmentLabel('asset-structure', null), 'Não se aplica');
  assert.equal(getEquipmentLabel('asset-structure', 'ZEISS PRISMO'), 'ZEISS PRISMO');
  assert.equal(requiresQuoteEquipment({serviceId:'training'}), false);
  assert.equal(requiresQuoteEquipment({serviceId:'training',items:[{serviceId:'scan'}]}), true);
});
