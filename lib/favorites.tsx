import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type FavoritesContextValue = {
  savedIds: string[];
  toggleSaved: (id: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>(["harbor-hill"]);
  const value = useMemo(() => ({
    savedIds,
    toggleSaved: (id: string) => setSavedIds((current) => current.includes(id) ? current.filter((savedId) => savedId !== id) : [...current, id]),
  }), [savedIds]);
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const value = useContext(FavoritesContext);
  if (!value) throw new Error("useFavorites must be used inside FavoritesProvider");
  return value;
}
