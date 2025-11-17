import { useState, useCallback } from 'react';

type UndoRedoState<T> = {
  past: T[];
  present: T;
  future: T[];
};

export const useUndoRedo = <T,>(initialPresent: T | (() => T)) => {
  const [state, setState] = useState<UndoRedoState<T>>(() => {
    const present =
      typeof initialPresent === 'function'
        ? (initialPresent as () => T)()
        : initialPresent;
    return {
      past: [],
      present,
      future: [],
    };
  });

  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => {
    if (!canUndo) return;
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, state.past.length - 1);
    setState({
      past: newPast,
      present: previous,
      future: [state.present, ...state.future],
    });
  }, [canUndo, state]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    setState({
      past: [...state.past, state.present],
      present: next,
      future: newFuture,
    });
  }, [canRedo, state]);

  const set = useCallback((newPresent: T) => {
    if (newPresent === state.present) return;
    setState({
      past: [...state.past, state.present],
      present: newPresent,
      future: [],
    });
  }, [state.present, state.past]);
  
  const reset = useCallback((newPresent: T) => {
    setState({
      past: [],
      present: newPresent,
      future: [],
    });
  }, []);

  return [state.present, { set, undo, redo, reset, canUndo, canRedo }] as const;
};
