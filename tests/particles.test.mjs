import assert from 'node:assert/strict';
import { test } from 'node:test';
import { particleScenes } from '../src/data/particles.ts';
import { stopCharacters } from '../src/data/characters.ts';

test('las cinco paradas reutilizan el mismo efecto de círculos luminosos', () => {
  assert.deepEqual(particleScenes.map((scene) => scene.stopId), stopCharacters.map((entry) => entry.stopId));
  assert.ok(particleScenes.every((scene) => scene.config.enabled));
  assert.ok(particleScenes.every((scene) => scene.config === particleScenes[0].config));
  assert.equal(particleScenes[0].config.type, 'glow-circle');
  for (const { config } of particleScenes) {
    assert.ok(Number.isInteger(config.density) && config.density >= 4 && config.density <= 16);
    assert.ok(Number.isFinite(config.speed) && config.speed > 0 && config.speed <= 12);
    assert.ok(Number.isFinite(config.size) && config.size >= 8 && config.size <= 18);
    assert.ok(Number.isFinite(config.lifetimeSeconds) && config.lifetimeSeconds >= 2 && config.lifetimeSeconds <= 8);
    assert.ok(config.colors.every((color) => /^#[0-9a-f]{6}$/i.test(color)));
  }
});
