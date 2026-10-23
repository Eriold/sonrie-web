export type DialogueAction = Readonly<{
  kind: 'social' | 'credential';
  label: string;
  url: string;
  confirmed: boolean;
}>;

export type StopDialogue = Readonly<{
  stopId: string;
  subjectStatus: 'prototype' | 'verified-person';
  personName?: string;
  pages: readonly string[];
  actions: readonly DialogueAction[];
}>;

// Estos textos describen rasgos observables del recorrido; no atribuyen cargos ni servicios.
// Las acciones se dejan vacías hasta recibir identidad, enlaces y validación de cada persona.
export const dialogues: readonly StopDialogue[] = [
  {
    stopId: 'parada-1', subjectStatus: 'prototype', actions: [],
    pages: ['Esta ilustración es provisional. La fotografía muestra la recepción de Sonríe.', 'Observa este espacio antes de continuar con el recorrido.'],
  },
  {
    stopId: 'parada-2', subjectStatus: 'prototype', actions: [],
    pages: ['Esta parada continúa en la zona de recepción.', 'El siguiente video conduce hacia el interior.'],
  },
  {
    stopId: 'parada-3', subjectStatus: 'prototype', actions: [],
    pages: ['Esta fotografía muestra una sala con sillón odontológico y reloj de pared.', 'El recorrido continúa hacia el pasillo.'],
  },
  {
    stopId: 'parada-5', subjectStatus: 'prototype', actions: [],
    pages: ['Esta fotografía muestra la sala del cuadro de colibrí.', 'El siguiente video parte de este espacio.'],
  },
  {
    stopId: 'parada-6', subjectStatus: 'prototype', actions: [],
    pages: ['Esta fotografía cierra el recorrido en la sala del panel azul.', 'Puedes regresar a cualquier parada desde la navegación.'],
  },
];

export function visibleDialogueActions(dialogue: Pick<StopDialogue, 'subjectStatus' | 'personName' | 'actions'>): readonly DialogueAction[] {
  if (dialogue.subjectStatus !== 'verified-person' || !dialogue.personName?.trim()) return [];
  return dialogue.actions.filter((action) => {
    if (!action.confirmed || !action.label.trim()) return false;
    try {
      const url = new URL(action.url);
      return url.protocol === 'https:' && (action.kind === 'social' || url.hostname === 'web.sispro.gov.co');
    } catch {
      return false;
    }
  });
}
