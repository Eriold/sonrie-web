// Los PNG son prototipos reemplazables; no representan a integrantes reales del equipo.
export type CharacterPrototype = Readonly<{
  id: string;
  imageAsset: string;
  displayLabel: string;
  visualReference: string;
  status: 'prototype';
}>;

export type StopCharacter = Readonly<{
  stopId: string;
  characterId: string;
  revealAfterProgress: number;
}>;

export const characterPrototypes: readonly CharacterPrototype[] = [
  { id: 'recepcion', imageAsset: 'Friendly Mint Receptionist Illustration.png', displayLabel: 'Guía ilustrativa de recepción', visualReference: 'Portapapeles y pañuelo verde', status: 'prototype' },
  { id: 'espejo', imageAsset: 'Friendly Anime Dentist with Dental Mirror.png', displayLabel: 'Guía ilustrativa del recorrido', visualReference: 'Espejo dental y uniforme verde claro', status: 'prototype' },
  { id: 'modelo-dental', imageAsset: 'Friendly Anime Dentist Demonstrating Dental Model.png', displayLabel: 'Guía ilustrativa del recorrido', visualReference: 'Modelo de dentadura y uniforme azul', status: 'prototype' },
  { id: 'modelo-aparatos', imageAsset: 'Friendly Orthodontist Presenting Braces Model.png', displayLabel: 'Guía ilustrativa del recorrido', visualReference: 'Modelo de dentadura y uniforme azul', status: 'prototype' },
];

// Cada parada dura 1,5 unidades de scroll. El primer 35 % deja apreciar la foto sola.
// La aparición se resuelve por progreso, también al retroceder, sin temporizadores.
export const stopCharacters: readonly StopCharacter[] = [
  { stopId: 'parada-1', characterId: 'recepcion', revealAfterProgress: 0.35 },
  { stopId: 'parada-2', characterId: 'recepcion', revealAfterProgress: 0.35 },
  { stopId: 'parada-3', characterId: 'espejo', revealAfterProgress: 0.35 },
  { stopId: 'parada-5', characterId: 'modelo-dental', revealAfterProgress: 0.35 },
  { stopId: 'parada-6', characterId: 'modelo-aparatos', revealAfterProgress: 0.35 },
];

export function resolveStopCharacter(stopId: string | null, stopProgress: number): CharacterPrototype | null {
  if (!stopId || !Number.isFinite(stopProgress)) return null;
  const assignment = stopCharacters.find((entry) => entry.stopId === stopId);
  if (!assignment || stopProgress < assignment.revealAfterProgress) return null;
  return characterPrototypes.find((character) => character.id === assignment.characterId) ?? null;
}
