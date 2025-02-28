import { RefObject, KeyboardEvent } from "react"
import { ChatDataType, DocumentPreviewType } from "./datatypes"

export interface IconProps {
  className?: string
  width?: string
  height?: string
}

export interface ButtonProps {
  children?: React.ReactNode
  type?: "primary" | "secondary" | "link"
  className?: string
  disabled?: boolean
  loading?: boolean
  onClick?: (e?: any) => void
}

export interface CardProps {
  type: string,
  children?: React.ReactNode,
  className?: string
}

export interface InputProps {
  label?: string,
  name?: string,
  type?: 'text' | 'password' | 'email' | 'number',
  value?: string,
  placeholder?: string,
  onChange?: (v: string) => void,
  className?: string,
  error?: string,
  setPasswordState?: (value: boolean) => void,
}

export interface ChatNameProps {
  className?: string
  editable?: boolean
  onChange?: (v: string) => void
  value?: string
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
  handlePress?: (e: KeyboardEvent<HTMLInputElement>) => void
  onBlur?: (e: any) => void
}

export interface MenuItemsProps {
  index: number
  name: string
  href: string
  disabled?: boolean
  icon: React.ReactNode
}

export interface PasswordDataProps {
  password: string;
  confirmPassword: string;
}

export interface UserDataProps {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

export interface MenuBackgroundIconProps extends React.SVGProps<SVGSVGElement> {
  translateX?: number;
}

export interface MenuItemProps {
  name?: string
  icon?: React.ReactNode
  onClick?: (index: number) => void
  isCollapsed?: boolean
  index?: number
  href?: string
  isActive?: boolean
}

export interface HeaderProps {
  title?: "Documents" | "Notifications" | "Market" | "Settings"
}

export interface CustomFileProps {
  id?: string
  filename: string
  original_filename: string
  file_type: string
  file_size: number
  path: string
  created_at?: string
  download_url?: string
  processed?: boolean
  user_id?: string
}
export interface FileCardProps {
  cloudType?: string
  fileData: CustomFileProps
  parentRef: RefObject<HTMLDivElement | null>
  onExpandPreview?: (e: DocumentPreviewType) => void
  showCheckBox: boolean
  setShowCheckBox: React.Dispatch<React.SetStateAction<boolean>>
}

interface DropdownItem {
  label: string
  onClick: () => void
  className?: string
}
export interface DropBoxProps {
  button: React.ReactNode
  className?: string
  items: DropdownItem[]
}

export interface ChatListProps {
  item: ChatDataType
  selected?: boolean
  onPin: () => void
  onDelete: () => void
}

export interface ChatDataProps {
  chatcontent?: Array<ChatDataType>
  /* eslint-disable @typescript-eslint/no-explicit-any */
  setChatContent?: (content: any) => void
}

export interface ChatContentProps {
  id: string
  setChatContent: (content: any) => void
}

export interface FileUploadCacheProps {
  batchId: string
  progress: number
  state: number
  name: string
}

export interface SocketProps {
  batch_id: string
  progress: number
  file_id?: string
  index?: number
}

export interface FileExpandCardProps {
  previewData: DocumentPreviewType | null;
  onClose?: () => void
}

export interface FileDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  file: CustomFileProps
}

export interface FilesDeleteModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface onUploadRespone {
  file_name: string
  message: string
  part_num: number[]
  presigned_url: string[]
  s3_path: string
  upload_id: string
}

export interface FileStateItemProps {
  progress: number
  state: number //0: init, 1: uploading, 2: success, 3: cancel, 4: error
  name: string
  index: number
}

export interface FilesUploadModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface CheckBoxProps {
  onClick: (e: any) => void
  file: CustomFileProps
}

export interface ParamsProps {
  file_type?: string
  search?: string
  created_at?: Date
}

export interface DropDownProps {
  className?: string
  label?: string
  options?: React.ReactNode[]
  default_option?: string
  icon?: React.ReactNode
  type?: string
  selectedOption?: string
  setParams?: React.Dispatch<React.SetStateAction<ParamsProps>>
}

export interface DaySelectorProps {
  className: string
  label: string
  default_option: string
  selectedDate: Date | undefined
  type: string
  setParams: React.Dispatch<React.SetStateAction<ParamsProps>>
}

export interface SearchProps {
  className?: string
  placeholder?: string
  icon?: React.ReactNode
  setParams: React.Dispatch<React.SetStateAction<ParamsProps>>
}

export interface ChatContentType {
  id?: string
  chatId?: string
  type?: string
  content?: string
  role?: string
  createdAt?: Date
  pinned?: boolean
}