declare global {
  namespace NodeJS {
    export interface GlobalStatic {
      toast(msg: string): void
    }
  }
}
