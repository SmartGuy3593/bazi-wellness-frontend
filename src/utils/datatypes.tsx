export interface ChatDataType {
  id: string
  description: string
  role: string
  created_at: Date
  pinned: boolean
}

export interface DocumentPreviewType {
  name?: string
  uri?: string | null
}
export interface GroupedItems {
  [key: string]: ChatDataType[]
}