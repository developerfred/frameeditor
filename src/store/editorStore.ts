import {create} from 'zustand'
import { HistoryManager } from '@/utils/historyManager'

interface Component {
  type: string
  props: Record<string, any>
  style: Record<string, any>
}

interface EditorState {
  components: Component[]
  selectedComponent: Component | null
  history: HistoryManager<Component[]>
  addComponent: (componentType: string) => void
  updateComponent: (index: number, updatedComponent: Component) => void
  selectComponent: (component: Component | null, index: number) => void
  undo: () => void
  redo: () => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  components: [],
  selectedComponent: null,
  history: new HistoryManager<Component[]>([]),
  
  addComponent: (componentType) => {
    const newComponent = {
      type: componentType,
      props: {},
      style: { position: 'relative' },
    }
    set(state => {
      const newComponents = [...state.components, newComponent]
      state.history.push(newComponents)
      return { components: newComponents }
    })
  },
  
  updateComponent: (index, updatedComponent) => {
    set(state => {
      const newComponents = [...state.components]
      newComponents[index] = updatedComponent
      state.history.push(newComponents)
      return { components: newComponents }
    })
  },
  
  selectComponent: (component, index) => {
    set({ selectedComponent: component ? { ...component, index } : null })
  },
  
  undo: () => {
    const { history } = get()
    if (history.canUndo()) {
      const previousState = history.undo()
      set({ components: previousState || [] })
    }
  },
  
  redo: () => {
    const { history } = get()
    if (history.canRedo()) {
      const nextState = history.redo()
      set({ components: nextState || [] })
    }
  },
}))