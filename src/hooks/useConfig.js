import { useReducer, useCallback } from 'react';
import { setPath } from '../lib/utils';

const MAX_HISTORY = 100;
const COALESCE_MS = 700;

const initialState = (value) => ({ past: [], present: value, future: [], lastKey: null, lastAt: 0 });

function commit(state, next, key) {
  if (next === state.present) return state;
  const now = Date.now();
  // Rapid edits to the same field (i.e. typing) collapse into one undo step.
  const coalesce = key && key === state.lastKey && now - state.lastAt < COALESCE_MS;
  return {
    past: coalesce ? state.past : [...state.past, state.present].slice(-MAX_HISTORY),
    present: next, future: [], lastKey: key, lastAt: now,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'RESET': return initialState(action.value);
    case 'SET': return commit(state, setPath(state.present, action.path, action.value), action.path);
    case 'UPDATE': return commit(state, action.fn(state.present), null);
    case 'UNDO': {
      if (!state.past.length) return state;
      return { past: state.past.slice(0, -1), present: state.past.at(-1), future: [state.present, ...state.future], lastKey: null, lastAt: 0 };
    }
    case 'REDO': {
      if (!state.future.length) return state;
      const [next, ...future] = state.future;
      return { past: [...state.past, state.present], present: next, future, lastKey: null, lastAt: 0 };
    }
    default: return state;
  }
}

/**
 * Invitation config state with undo/redo.
 *   set('event.title', 'Hi')   – immutable deep set by dot path
 *   update(cfg => newCfg)      – arbitrary change (list add/remove/reorder, template swap)
 */
export function useConfig(initial) {
  const [state, dispatch] = useReducer(reducer, initial, initialState);
  return {
    config: state.present,
    set: useCallback((path, value) => dispatch({ type: 'SET', path, value }), []),
    update: useCallback((fn) => dispatch({ type: 'UPDATE', fn }), []),
    undo: useCallback(() => dispatch({ type: 'UNDO' }), []),
    redo: useCallback(() => dispatch({ type: 'REDO' }), []),
    reset: useCallback((value) => dispatch({ type: 'RESET', value }), []),
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
