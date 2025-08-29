import * as React from 'react';
import { Plate, createPlateEditor } from 'platejs/react';
import { BaseEditorKit } from '@/components/editor/editor-base-kit';
import { Editor, EditorContainer } from '@/components/ui/editor';
import { FixedToolbar } from '@/components/ui/fixed-toolbar';
import { FloatingToolbar, FloatingToolbarButtons } from '@/components/ui/floating-toolbar';
import { MarkToolbarButton } from '@/components/ui/mark-toolbar-button';
import { ToolbarButton } from '@/components/ui/toolbar';
import { Value } from '@platejs/core';

const initialValue: Value = [
    {
      type: 'h2',
      children: [{ text: 'Hi there,' }],
    },
    {
      type: 'p',
      children: [
        { text: 'this is a ' },
        { text: 'basic', italic: true },
        { text: ' example of ' },
        { text: 'Tiptap', bold: true },
        { text: '. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:' },
      ],
    },
    {
        type: 'ul',
        children: [
            {
                type: 'li',
                children: [
                    {
                        type: 'p',
                        children: [{ text: 'That’s a bullet list with one …' }],
                    },
                ],
            },
            {
                type: 'li',
                children: [
                    {
                        type: 'p',
                        children: [{ text: '… or two list items.' }],
                    },
                ],
            },
        ],
    },
    {
      type: 'p',
      children: [
        { text: 'Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:' },
      ],
    },
    {
        type: 'code_block',
        lang: 'css',
        children: [
            {
                type: 'code_line',
                children: [{ text: 'body {' }],
            },
            {
                type: 'code_line',
                children: [{ text: '  display: none;' }],
            },
            {
                type: 'code_line',
                children: [{ text: '}' }],
            },
        ],
    },
    {
      type: 'p',
      children: [
        { text: 'I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.' },
      ],
    },
    {
      type: 'blockquote',
      children: [{ text: 'Wow, that’s amazing. Good work, boy! 👏\n— Mom' }],
    },
  ];

export default function PlateEditor() {
    const [editor] = React.useState(() => createPlateEditor({
        plugins: BaseEditorKit,
        value: (() => {
            const savedValue = localStorage.getItem('plate-content');
            return savedValue ? JSON.parse(savedValue) : initialValue;
        })(),
    }));

  return (
    <Plate
        editor={editor}
        onChange={({ value }) => {
            localStorage.setItem('plate-content', JSON.stringify(value));
        }}
    >
      <FixedToolbar className="flex justify-start gap-1 rounded-t-lg">
        {/* Element Toolbar Buttons */}
        <ToolbarButton onClick={() => editor.tf.h1.toggle()}>H1</ToolbarButton>
        <ToolbarButton onClick={() => editor.tf.h2.toggle()}>H2</ToolbarButton>
        <ToolbarButton onClick={() => editor.tf.h3.toggle()}>H3</ToolbarButton>
        <ToolbarButton onClick={() => editor.tf.blockquote.toggle()}>Quote</ToolbarButton>
        {/* Mark Toolbar Buttons */}
        <MarkToolbarButton nodeType="bold" tooltip="Bold (⌘+B)">B</MarkToolbarButton>
        <MarkToolbarButton nodeType="italic" tooltip="Italic (⌘+I)">I</MarkToolbarButton>
        <MarkToolbarButton nodeType="underline" tooltip="Underline (⌘+U)">U</MarkToolbarButton>
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
