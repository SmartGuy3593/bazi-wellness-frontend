import { atom } from "jotai"
import { ChatDataType } from "./datatypes"
import { CustomFileProps, FileStateItemProps } from "./props"

// export const userDataAtom = atom<any>(null)
export const userDataAtom = atom<string>("none")
export const usersDataAtom = atom<any[]>([])
export const chatDataAtom = atom<ChatDataType | null>(null)
export const checkedFilesAtom = atom<CustomFileProps[]>([])
export const uploadFileListAtom = atom<File[]>([])
export const previousLengthAtom = atom<number>(0)
export const uploadTotalProgressAtom = atom<number>(0)
export const documentPreviewAtom = atom<string>("")
export const fileStateItemsAtom = atom<FileStateItemProps[]>([])
export const uploadSpeedAtom = atom<number>(0)
export const fileListAtom = atom<CustomFileProps[]>([])
