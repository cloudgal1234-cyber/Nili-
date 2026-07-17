export { generateBoard, generateUniqueBoard } from './generator';
export type { GenerateBoardOptions } from './generator';
export { countSolutions, isBoardUniquelySolvable } from './solver';
export { validateGeneratedBoard, checkBoardCompletion } from './validator';
export type { ValidationIssue } from './validator';
export { deriveWordSlots, slotId } from './types';
export type { Template, TemplateCell, TemplateArrow, WordSlotDef } from './types';
export { indexByLength, indexByWord } from './dictionaryIndex';
