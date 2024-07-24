import type * as api from './index'
export type Procedure = keyof typeof api
export type ProcedureArgs<P extends Procedure> = Parameters<(typeof api)[P]>[0]
export type ProcedureResults<P extends Procedure> = Awaited<ReturnType<(typeof api)[P]>>
