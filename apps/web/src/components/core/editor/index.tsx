
import { Gapcursor } from '@tiptap/extension-gapcursor'
import Link from '@tiptap/extension-link'
import { TableKit } from '@tiptap/extension-table'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { EditorBubbleMenu } from './BubbleMenu'
import { EditorFloatingMenu } from './FloatingMenu'
import { MenuBar } from './MenuBar'
import './styles.css'

const extensions = [
  StarterKit,
  TableKit.configure({
    table: {
      resizable: true,
    },
  }),
  Link.configure({
    openOnClick: false,
  }),
  Gapcursor,
]

export default () => {
  const editor = useEditor({
    extensions,
    content: `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>Tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
  display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`,
  })
  return (
    <div>
      <MenuBar editor={editor} />
      {editor && <EditorBubbleMenu editor={editor} />}
      {editor && <EditorFloatingMenu editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  )
}
