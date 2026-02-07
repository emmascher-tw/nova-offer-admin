import { create } from 'zustand';

const useUiStore = create((set) => ({
  activeTab: 0,
  setActiveTab: (tab) => set({ activeTab: tab }),

  jsonPanelOpen: false,
  toggleJsonPanel: () => set((s) => ({ jsonPanelOpen: !s.jsonPanelOpen })),
  setJsonPanelOpen: (open) => set({ jsonPanelOpen: open }),

  versionPanelOpen: false,
  toggleVersionPanel: () => set((s) => ({ versionPanelOpen: !s.versionPanelOpen })),
  setVersionPanelOpen: (open) => set({ versionPanelOpen: open }),

  confirmDialog: null,
  openConfirmDialog: (config) => set({ confirmDialog: config }),
  closeConfirmDialog: () => set({ confirmDialog: null }),
}));

export default useUiStore;
