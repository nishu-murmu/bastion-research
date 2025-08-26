import { type Editor } from '@tiptap/react'
import { FloatingElement as FloatingMenu } from '@/components/tiptap-ui-utils/floating-element'
import {
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Merge,
  Split,
  Columns,
  Rows,
} from 'lucide-react'

type Props = {
  editor: Editor
}

export const EditorFloatingMenu = ({ editor }: Props) => {
  return (
    <FloatingMenu
      editor={editor}
      // shouldShow={({ editor }) => editor.isActive('table')}
      // tippyOptions={{
      //   duration: 100,
      //   placement: 'top',
      // }}
      className="flex items-center gap-1 p-2 bg-white border border-gray-200 rounded-lg shadow-md"
    >
      <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
        <Plus className="w-4 h-4" />
      </button>
      <button onClick={() => editor.chain().focus().addColumnBefore().run()}>
        <ArrowLeft className="w-4 h-4" />
      </button>
      <button onClick={() => editor.chain().focus().addColumnAfter().run()}>
        <ArrowRight className="w-4 h-4" />
      </button>
      <button onClick={() => editor.chain().focus().deleteColumn().run()}>
        <Columns className="w-4 h-4" />
      </button>
      <button onClick={() => editor.chain().focus().addRowBefore().run()}>
        <ArrowUp className="w-4 h-4" />
      </button>
      <button onClick={() => editor.chain().focus().addRowAfter().run()}>
        <ArrowDown className="w-4 h-4" />
      </button>
      <button onClick={() => editor.chain().focus().deleteRow().run()}>
        <Rows className="w-4 h-4" />
      </button>
      <button onClick={() => editor.chain().focus().deleteTable().run()}>
        <Trash2 className="w-4 h-4" />
      </button>
      <button onClick={() => editor.chain().focus().mergeCells().run()}>
        <Merge className="w-4 h-4" />
      </button>
      <button onClick={() => editor.chain().focus().splitCell().run()}>
        <Split className="w-4 h-4" />
      </button>
    </FloatingMenu>
  )
}
