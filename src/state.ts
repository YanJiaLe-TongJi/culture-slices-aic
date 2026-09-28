import { objects, type ActionId, type ObjectId } from './content';
export const STORAGE_KEY = 'culture-slice:progress:v1';
export interface Progress { version: 1; entered: boolean; viewed: ObjectId[]; actions: ActionId[]; grinding: number }
export const initialProgress = (): Progress => ({ version: 1, entered: false, viewed: [], actions: [], grinding: 0 });
export type Event = { type: 'enter' } | { type: 'view'; id: ObjectId } | { type: 'place' } | { type: 'grind'; amount: number } | { type: 'replay' } | { type: 'reset' };
export function transition(state: Progress, event: Event): Progress {
  switch (event.type) {
    case 'enter': return { ...state, entered: true };
    case 'view': return { ...state, viewed: Array.from(new Set([...state.viewed, event.id])) };
    case 'place': return { ...state, actions: Array.from(new Set([...state.actions, 'placed' as const])) };
    case 'grind': {
      if (!state.actions.includes('placed') || !Number.isFinite(event.amount)) return state;
      const grinding = Math.min(1, Math.max(0, state.grinding + Math.max(0, event.amount)));
      return { ...state, grinding, actions: grinding >= 1 ? Array.from(new Set([...state.actions, 'ground' as const])) : state.actions };
    }
    case 'replay': return { ...state, grinding: 0, actions: state.actions.filter(a => a !== 'ground') };
    case 'reset': return initialProgress();
  }
}
export function restoreProgress(raw: string | null): Progress {
  try {
    const data = JSON.parse(raw || 'null');
    if (!data || data.version !== 1 || !Array.isArray(data.viewed) || !Array.isArray(data.actions)) return initialProgress();
    const actions = Array.from(new Set(data.actions.filter((x: unknown) => x === 'placed' || x === 'ground'))) as ActionId[];
    if (actions.includes('ground') && !actions.includes('placed')) actions.push('placed');
    return { version: 1, entered: data.entered === true, viewed: Array.from(new Set(data.viewed.filter((x: unknown) => objects.some(o=>o.id===x)))) as ObjectId[], actions, grinding: actions.includes('ground') ? 1 : actions.includes('placed') && Number.isFinite(data.grinding) ? Math.max(0, Math.min(0.99, data.grinding)) : 0 };
  } catch { return initialProgress(); }
}
