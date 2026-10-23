import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import { test } from 'node:test';
import { characterPrototypes, stopCharacters, resolveStopCharacter } from '../src/data/characters.ts';
import { tourSegments } from '../src/data/tour.ts';

test('los cuatro prototipos cubren las cinco paradas fotográficas sin atribuir identidad profesional', async () => {
  assert.equal(characterPrototypes.length, 4);
  assert.deepEqual(stopCharacters.map((entry) => entry.stopId), tourSegments.map((segment) => segment.stopId));
  assert.equal(new Set(stopCharacters.map((entry) => entry.characterId)).size, 4);
  for (const prototype of characterPrototypes) {
    assert.equal(prototype.status, 'prototype');
    assert.match(prototype.displayLabel, /ilustrativ/i);
    assert.doesNotMatch(prototype.displayLabel, /odont[oó]log|ortodon|doctora?|especialista/i);
    assert.ok((await stat(new URL(`../assets/${prototype.imageAsset}`, import.meta.url))).size > 0);
  }
});

test('cada fotografía queda sola al entrar y el personaje aparece tras avanzar en su parada', () => {
  for (const entry of stopCharacters) {
    assert.ok(entry.revealAfterProgress > 0 && entry.revealAfterProgress < 0.5);
    assert.equal(resolveStopCharacter(entry.stopId, 0), null);
    assert.equal(resolveStopCharacter(entry.stopId, entry.revealAfterProgress - 0.001), null);
    assert.equal(resolveStopCharacter(entry.stopId, entry.revealAfterProgress)?.id, entry.characterId);
    assert.equal(resolveStopCharacter(entry.stopId, 1)?.id, entry.characterId);
  }
  assert.equal(resolveStopCharacter('parada-desconocida', 1), null);
});
