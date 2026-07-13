export interface AstNode {
  type: string
  start: number
  end: number
  [key: string]: unknown
}

export interface ProjectInput {
  files: ReadonlyMap<string, string>
  resolutions: ReadonlyMap<string, string>
}

export interface DefinitionSite {
  id: string
  name: string
  start: number
  end: number
  initializer: AstNode | null
}

export interface ReferenceSite {
  id: string
  name: string
  start: number
  end: number
}

export interface ParseDiagnostic {
  id: string
  message: string
}

export interface AnalyzerCandidate {
  readonly name: 'yuku'
  addFile(id: string, source: string): void
  removeFile(id: string): boolean
  link(): void
  definitionOf(id: string, localName: string): DefinitionSite | null
  referencesOf(definition: DefinitionSite): ReferenceSite[]
  dependenciesOf(id: string): string[]
  dependentsOf(id: string): string[]
  affectedBy(id: string): string[]
  programOf(id: string): AstNode
  sourceOf(id: string): string
  parseCount(id: string): number
  diagnostics(): ParseDiagnostic[]
}

export interface CandidateFactory {
  name: AnalyzerCandidate['name']
  create(project: ProjectInput): AnalyzerCandidate
}

export function resolutionKey(importer: string, specifier: string): string {
  return `${importer}\0${specifier}`
}

export function resolveFromHost(
  resolutions: ReadonlyMap<string, string>,
  specifier: string,
  importer: string
): string | null {
  return resolutions.get(resolutionKey(importer, specifier)) ?? null
}
