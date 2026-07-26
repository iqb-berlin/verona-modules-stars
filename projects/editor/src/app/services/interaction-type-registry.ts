import { Type } from '@angular/core';
import { InteractionEnum } from '@shared/models/unit-definition';
import {
  InteractionButtonsEditorComponent
} from '../components/interaction-buttons-editor/interaction-buttons-editor.component';
import { InteractionDropEditorComponent } from '../components/interaction-drop-editor/interaction-drop-editor.component';
import {
  InteractionEquationEditorComponent
} from '../components/interaction-equation-editor/interaction-equation-editor.component';
import {
  InteractionFindOnImageEditorComponent
} from '../components/interaction-find-on-image-editor/interaction-find-on-image-editor.component';
import { InteractionMetaEditorComponent } from '../components/interaction-meta-editor/interaction-meta-editor.component';
import {
  InteractionNumberLineEditorComponent
} from '../components/interaction-number-line-editor/interaction-number-line-editor.component';
import {
  InteractionPlaceValueEditorComponent
} from '../components/interaction-place-value-editor/interaction-place-value-editor.component';
import {
  InteractionPolygonButtonsEditorComponent
} from '../components/interaction-polygon-buttons-editor/interaction-polygon-buttons-editor.component';
import {
  InteractionPyramidEditorComponent
} from '../components/interaction-pyramid-editor/interaction-pyramid-editor.component';
import { InteractionVideoEditorComponent } from '../components/interaction-video-editor/interaction-video-editor.component';
import { InteractionWriteEditorComponent } from '../components/interaction-write-editor/interaction-write-editor.component';
import {
  EditorInteractionAdapter,
  INTERACTION_ADAPTERS
} from './editor-interaction-adapters';

export interface InteractionTypeDescriptor {
  type: InteractionEnum;
  label: InteractionEnum;
  description: string;
  visible: boolean;
  hasVariable: boolean;
  emitsSelection: boolean;
  supportsAudioFeedback: boolean;
  editorComponent: Type<unknown> | null;
  adapter: EditorInteractionAdapter;
}

export const INTERACTION_TYPE_DESCRIPTORS = {
  BUTTONS: descriptor(
    'BUTTONS', 'Auswahl über Schaltflächen', InteractionButtonsEditorComponent, true, true
  ),
  IMAGE_ONLY: descriptor(
    'IMAGE_ONLY', 'Statisches Bild', InteractionButtonsEditorComponent, false, false
  ),
  WRITE: descriptor('WRITE', 'Eingabe über Tastatur', InteractionWriteEditorComponent, false, true),
  DROP: descriptor('DROP', 'Drag & Drop', InteractionDropEditorComponent, true, true),
  FIND_ON_IMAGE: descriptor(
    'FIND_ON_IMAGE', 'Bereich in einem Bild finden', InteractionFindOnImageEditorComponent, false, true
  ),
  VIDEO: descriptor('VIDEO', 'Video-Player', InteractionVideoEditorComponent, false, false),
  POLYGON_BUTTONS: descriptor(
    'POLYGON_BUTTONS',
    'Auswahl über Polygon-Regionen',
    InteractionPolygonButtonsEditorComponent,
    true,
    true
  ),
  PLACE_VALUE: descriptor(
    'PLACE_VALUE', 'Stellenwerttafel', InteractionPlaceValueEditorComponent, false, true
  ),
  NUMBER_LINE: descriptor(
    'NUMBER_LINE', 'Zahlenstrahl', InteractionNumberLineEditorComponent, false, true
  ),
  PYRAMID: descriptor('PYRAMID', 'Rechenpyramide', InteractionPyramidEditorComponent, false, true),
  EQUATION: descriptor('EQUATION', 'Gleichung oder Term', InteractionEquationEditorComponent, false, true),
  META: descriptor('META', 'Meta-Auswahl', InteractionMetaEditorComponent, false, false),
  NONE: descriptor('NONE', 'Keine Interaktion', null, false, false, false)
} satisfies Record<InteractionEnum, InteractionTypeDescriptor>;

function descriptor(
  type: InteractionEnum,
  description: string,
  editorComponent: Type<unknown> | null,
  emitsSelection: boolean,
  supportsAudioFeedback: boolean,
  visible = true
): InteractionTypeDescriptor {
  return {
    type,
    label: type,
    description,
    visible,
    hasVariable: INTERACTION_ADAPTERS[type].hasVariable,
    emitsSelection,
    supportsAudioFeedback,
    editorComponent,
    adapter: INTERACTION_ADAPTERS[type]
  };
}
