import { BubbleMenu, type Editor } from '@tiptap/react'
import { Bold, Italic, Strikethrough, Link } from 'lucide-react'

type Props = {
  editor: Editor
}

export const EditorBubbleMenu = ({ editor }: Props) => {
  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      shouldShow={({ editor, view, state, from, to }) => {
        // only show the bubble menu for text selections.
        const { doc, selection } = state
        const { empty } = selection
        return from !== to && !empty
      }}
      className="flex items-center gap-1 p-2 bg-white border border-gray-200 rounded-lg shadow-md"
    >
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        <Strikethrough className="w-4 h-4" />
      </button>
      <button onClick={setLink} className={editor.isActive('link') ? 'is-active' : ''}>
        <Link className="w-4 h-4" />
      </button>
    </BubbleMenu>
  )
}
