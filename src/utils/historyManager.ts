export class HistoryManager<T> {
  private past: T[] = []
  private future: T[] = []
  private present: T

  constructor(initialState: T) {
    this.present = initialState
  }

  public get state(): T {
    return this.present
  }

  public push(newState: T): void {
    this.past.push(this.present)
    this.present = newState
    this.future = []
  }

  public undo(): T | undefined {
    if (this.past.length === 0) return undefined

    const previousState = this.past.pop()!
    this.future.push(this.present)
    this.present = previousState
    return this.present
  }

  public redo(): T | undefined {
    if (this.future.length === 0) return undefined

    const nextState = this.future.pop()!
    this.past.push(this.present)
    this.present = nextState
    return this.present
  }

  public canUndo(): boolean {
    return this.past.length > 0
  }

  public canRedo(): boolean {
    return this.future.length > 0
  }
}
