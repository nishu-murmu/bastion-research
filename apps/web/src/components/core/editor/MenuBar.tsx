import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Editor } from '@tiptap/react'
import {
  Bold,
  ChevronDown,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo,
  Strikethrough,
  Table,
  Undo,
} from 'lucide-react'

type Props = {
  editor: Editor | null
}

export function MenuBar({ editor }: Props) {
  if (!editor) {
    return null
  }

  return (
    <div className="flex items-center gap-2 p-2 border-b border-gray-200">
      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={editor.isActive('code') ? 'is-active' : ''}
        >
          <Code className="w-4 h-4" />
        </button>
      </div>

      <div className="h-6 border-l border-gray-200" />

      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1">
              {editor.isActive('heading', { level: 1 }) && <Heading1 className="w-4 h-4" />}
              {editor.isActive('heading', { level: 2 }) && <Heading2 className="w-4 h-4" />}
              {editor.isActive('heading', { level: 3 }) && <Heading3 className="w-4 h-4" />}
              {!editor.isActive('heading') && <Pilcrow className="w-4 h-4" />}
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>
              <Pilcrow className="w-4 h-4 mr-2" />
              Paragraph
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
              <Heading1 className="w-4 h-4 mr-2" />
              Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
              <Heading2 className="w-4 h-4 mr-2" />
              Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
              <Heading3 className="w-4 h-4 mr-2" />
              Heading 3
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="h-6 border-l border-gray-200" />

      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      <div className="h-6 border-l border-gray-200" />

      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
        >
          <Code2 className="w-4 h-4" />
        </button>
      </div>

      <div className="h-6 border-l border-gray-200" />

      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
        >
          <Table className="w-4 h-4" />
        </button>
      </div>

      <div className="h-6 border-l border-gray-200" />

      <div className="flex items-center gap-1">
        <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo className="w-4 h-4" />
        </button>
        <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
