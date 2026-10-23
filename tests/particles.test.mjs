import assert from 'node:assert/strict';
import { test } from 'node:test';
import { particleScenes } from '../src/data/particles.ts';
import { stopCharacters } from '../src/data/characters.ts';

test('cada parada permite activar o desactivar un efecto ambiental configurado', () => {
  assert.deepEqual(particleScenes.map((scene) => scene.stopId), stopCharacters.map((entry) => entry.stopId));
  assert.ok(particleScenes.some((scene) => !scene.config.enabled));
  assert.deepEqual(new Set(particleScenes.filter((scene) => scene.config.enabled).map((scene) => scene.config.type)), new Set(['dust', 'sparkle', 'soft-glow']));
  for (const { config } of particleScenes) {
    assert.ok(Number.isInteger(config.density) && config.density >= 0 && config.density <= 32);
    assert.ok(Number.isFinite(config.speed) && config.speed >= 0 && config.speed <= 30);
    assert.ok(Number.isFinite(config.size) && config.size > 0 && config.size <= 24);
    assert.ok(config.colors.every((color) => /^#[0-9a-f]{6}$/i.test(color)));
  }
});
