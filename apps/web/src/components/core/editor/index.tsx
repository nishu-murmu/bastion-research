"use client";
import { useEffect } from "react";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import "./styles.css";

import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  CodeSquare,
  Minus,
  CornerDownLeft,
  Undo2,
  Redo2,
  Eraser,
  Pilcrow,
  LinkIcon,
  ImageIcon,
  Highlighter,
  Save,
  Trash2,
} from "lucide-react";

// Extensions
const extensions = [
  StarterKit,
  TextStyle,
  Color,
  Link.configure({
    openOnClick: false,
  }),
  Image,
  Highlight,
];

export function MenuBar({ editor }: { editor: any }) {
  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isStrike: ctx.editor.isActive("strike"),
      isCode: ctx.editor.isActive("code"),
      isParagraph: ctx.editor.isActive("paragraph"),
      isHeading1: ctx.editor.isActive("heading", { level: 1 }),
      isHeading2: ctx.editor.isActive("heading", { level: 2 }),
      isHeading3: ctx.editor.isActive("heading", { level: 3 }),
      isBulletList: ctx.editor.isActive("bulletList"),
      isOrderedList: ctx.editor.isActive("orderedList"),
      isCodeBlock: ctx.editor.isActive("codeBlock"),
      isBlockquote: ctx.editor.isActive("blockquote"),
      canUndo: ctx.editor.can().chain().undo().run(),
      canRedo: ctx.editor.can().chain().redo().run(),
    }),
  });

  const Btn = ({
    onClick,
    disabled,
    active,
    icon: Icon,
    label,
  }: {
    onClick: () => void;
    disabled?: boolean;
    active?: boolean;
    icon: React.ElementType;
    label: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={`p-2 text-sm flex items-center justify-center transition-colors 
        ${active ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"} 
        disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      <Icon size={16} />
    </button>
  );

  // File selector for images
  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          editor
            .chain()
            .focus()
            .setImage({ src: reader.result as string })
            .run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Save content manually
  const handleSave = () => {
    const json = editor.getJSON();
    localStorage.setItem("tiptap-content", JSON.stringify(json));
    alert("✅ Content saved!");
  };

  // Clear content
  const handleClear = () => {
    editor.commands.clearContent(true);
    localStorage.removeItem("tiptap-content");
  };

  return (
    <div className="border border-gray-200 justify-center bg-white rounded-lg shadow-sm flex flex-wrap divide-x divide-gray-200 overflow-hidden sticky top-0 z-10">
      <Btn
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editorState.isBold}
        icon={Bold}
        label="Bold"
      />
      <Btn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editorState.isItalic}
        icon={Italic}
        label="Italic"
      />
      <Btn
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editorState.isStrike}
        icon={Strikethrough}
        label="Strikethrough"
      />
      <Btn
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editorState.isCode}
        icon={Code}
        label="Inline Code"
      />
      <Btn
        onClick={() => editor.chain().focus().unsetAllMarks().run()}
        icon={Eraser}
        label="Clear Marks"
      />
      <Btn
        onClick={() => editor.chain().focus().setParagraph().run()}
        active={editorState.isParagraph}
        icon={Pilcrow}
        label="Paragraph"
      />
      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editorState.isHeading1}
        icon={Heading1}
        label="Heading 1"
      />
      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editorState.isHeading2}
        icon={Heading2}
        label="Heading 2"
      />
      <Btn
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editorState.isHeading3}
        icon={Heading3}
        label="Heading 3"
      />
      <Btn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editorState.isBulletList}
        icon={List}
        label="Bullet List"
      />
      <Btn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editorState.isOrderedList}
        icon={ListOrdered}
        label="Ordered List"
      />
      <Btn
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editorState.isCodeBlock}
        icon={CodeSquare}
        label="Code Block"
      />
      <Btn
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editorState.isBlockquote}
        icon={Quote}
        label="Blockquote"
      />
      <Btn
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        icon={Minus}
        label="Horizontal Rule"
      />
      <Btn
        onClick={() => editor.chain().focus().setHardBreak().run()}
        icon={CornerDownLeft}
        label="Hard Break"
      />
      <Btn
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editorState.canUndo}
        icon={Undo2}
        label="Undo"
      />
      <Btn
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editorState.canRedo}
        icon={Redo2}
        label="Redo"
      />
      <Btn
        onClick={() => {
          const url = prompt("Enter URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        icon={LinkIcon}
        label="Insert Link"
      />
      <Btn onClick={handleImageUpload} icon={ImageIcon} label="Insert Image" />
      <Btn
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        icon={Highlighter}
        label="Highlight"
      />

      {/* Save / Clear */}
      <Btn onClick={handleSave} icon={Save} label="Save" />
      <Btn onClick={handleClear} icon={Trash2} label="Clear" />
    </div>
  );
}

export default function RichEditor() {
  const editor = useEditor({
    extensions,
    content: `<h2>Welcome to the editor</h2><p>Type something, or insert an <strong>image</strong>.</p>`,
  });

  // Load saved content if available
  useEffect(() => {
    if (editor) {
      const saved = localStorage.getItem("tiptap-content");
      if (saved) {
        editor.commands.setContent(JSON.parse(saved));
      }

      // Save on every update
      editor.on("update", ({ editor }) => {
        localStorage.setItem(
          "tiptap-content",
          JSON.stringify(editor.getJSON())
        );
      });
    }
  }, [editor]);

  // Prevent refresh/close without warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
    <div className="space-y-2 max-w-4xl mx-auto">
      {editor && <MenuBar editor={editor} />}
      <div className="border border-gray-200 rounded-lg bg-gray shadow-sm h-[80dvh] overflow-hidden p-4">
        <EditorContent editor={editor} className="tiptap-editor" />
      </div>
    </div>
  );
}
