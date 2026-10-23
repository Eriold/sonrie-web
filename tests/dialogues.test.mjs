import assert from 'node:assert/strict';
import { test } from 'node:test';
import { dialogues, visibleDialogueActions } from '../src/data/dialogues.ts';
import { stopCharacters } from '../src/data/characters.ts';

test('cada parada tiene páginas de demostración sin identidad ni enlaces profesionales publicados', () => {
  assert.deepEqual(dialogues.map((dialogue) => dialogue.stopId), stopCharacters.map((entry) => entry.stopId));
  for (const dialogue of dialogues) {
    assert.equal(dialogue.subjectStatus, 'prototype');
    assert.ok(dialogue.pages.length >= 2);
    assert.ok(dialogue.pages.every((page) => page.trim().length > 0));
    assert.deepEqual(visibleDialogueActions(dialogue), []);
  }
});

test('redes y verificación solo se publican para una persona confirmada y con URL válida', () => {
  const actions = [
    { kind: 'social', label: 'Perfil público', url: 'https://example.com/perfil', confirmed: true },
    { kind: 'credential', label: 'Consultar ReTHUS', url: 'https://web.sispro.gov.co/THS/Cliente/ConsultasPublicas/ConsultaPublicaDeTHxIdentificacion.aspx', confirmed: true },
    { kind: 'social', label: 'Sin confirmar', url: 'https://example.com/otro', confirmed: false },
    { kind: 'social', label: 'Inseguro', url: 'javascript:alert(1)', confirmed: true },
    { kind: 'credential', label: 'Sitio ajeno', url: 'https://example.com/carnet', confirmed: true },
  ];
  assert.deepEqual(visibleDialogueActions({ subjectStatus: 'prototype', actions }), []);
  assert.deepEqual(visibleDialogueActions({ subjectStatus: 'verified-person', personName: '', actions }), []);
  assert.deepEqual(visibleDialogueActions({ subjectStatus: 'verified-person', personName: 'Persona confirmada', actions }).map((action) => action.label), ['Perfil público', 'Consultar ReTHUS']);
});
