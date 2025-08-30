import * as React from 'react';
import { Plate, createPlateEditor } from 'platejs/react';
import { BaseEditorKit } from '@/components/editor/editor-base-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { FixedToolbar } from '@/components/ui/fixed-toolbar';
import { FloatingToolbar, FloatingToolbarButtons } from '@/components/ui/floating-toolbar';
import { MarkToolbarButton } from '@/components/ui/mark-toolbar-button';
import { ToolbarButton } from '@/components/ui/toolbar';
import { Value } from '@platejs/core';
import { LinkToolbarButton } from '@platejs/link/react';
import { MediaToolbarButton } from '@platejs/media/react';
import { toggleList } from '@platejs/list';

export default function PlateEditor({ value, onChange }: { value: Value, onChange: (value: Value) => void }) {
    const editor = React.useMemo(() => createPlateEditor({
        plugins: BaseEditorKit,
    }), []);

  return (
    <Plate
        editor={editor}
        value={value}
        onChange={(newValue) => {
            onChange(newValue);
        }}
    >
      <FixedToolbar className="flex flex-wrap justify-start gap-1 rounded-t-lg">
        {/* Element Toolbar Buttons */}
        <ToolbarButton onClick={() => editor.tf.h1.toggle()}>H1</ToolbarButton>
        <ToolbarButton onClick={() => editor.tf.h2.toggle()}>H2</ToolbarButton>
        <ToolbarButton onClick={() => editor.tf.h3.toggle()}>H3</ToolbarButton>
        <ToolbarButton onClick={() => editor.tf.blockquote.toggle()}>Quote</ToolbarButton>
        <ToolbarButton onClick={() => toggleList(editor, { type: 'ul' })}>UL</ToolbarButton>
        <ToolbarButton onClick={() => toggleList(editor, { type: 'ol' })}>OL</ToolbarButton>
        <LinkToolbarButton />
        <MediaToolbarButton nodeType="img" />
        <MediaToolbarButton nodeType="media_embed" />
        {/* Mark Toolbar Buttons */}
        <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">B</MarkToolbarButton>
        <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">I</MarkToolbarButton>
        <MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)">U</MarkToolbarButton>
        <MarkToolbarButton nodeType="strikethrough" tooltip="Strikethrough (⌘+⇧+X)">S</MarkToolbarButton>
        <MarkToolbarButton nodeType="code" tooltip="Code (⌘+E)">C</MarkToolbarButton>
      </FixedToolbar>
      <FloatingToolbar>
        <FloatingToolbarButtons />
      </FloatingToolbar>
      <EditorContainer>
        <Editor placeholder="Type your amazing content here..." />
      </EditorContainer>
    </Plate>
  );
}
