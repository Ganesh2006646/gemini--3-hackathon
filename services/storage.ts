import { AppState, AppStep } from '../types';

const STORAGE_KEY = 'dispute_deescalator_v1_state';

export const saveState = (state: AppState) => {
  try {
    // Only save if we have moved past the initial empty intake
    if (state.step > AppStep.INTAKE || (state.step === AppStep.INTAKE && state.userDescription.length > 20)) {
      const stateToSave = {
        ...state,
        error: undefined // Don't persist errors
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    }
  } catch (e) {
    console.warn("Failed to save state to localStorage", e);
  }
};

export const loadState = (): AppState | null => {
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    // Simple validation
    if (!parsed.step || !parsed.userDescription) return null;
    
    return parsed as AppState;
  } catch (e) {
    console.warn("Failed to load state from localStorage", e);
    return null;
  }
};

export const clearState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn("Failed to clear localStorage", e);
  }
};

export const hasSavedState = (): boolean => {
  return !!localStorage.getItem(STORAGE_KEY);
};