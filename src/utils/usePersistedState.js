import { useState } from "react";

export default function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(localStorage.getItem(key) || defaultValue);

  return [state, setState];
}
