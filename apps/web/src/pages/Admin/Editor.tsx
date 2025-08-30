import React, { useState } from 'react';
import PlateEditor from '@/components/plate-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Value } from '@platejs/core';
import axiosInstance from '../../api/axios';

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
        { text: 'I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a a try and click a little bit around. Don’t forget to check the other examples too.' },
      ],
    },
    {
      type: 'blockquote',
      children: [{ text: 'Wow, that’s amazing. Good work, boy! 👏\n— Mom' }],
    },
  ];

const EditorPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<Value>(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (status: 'draft' | 'published') => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/blog', {
        title,
        content,
        status,
      });
      console.log('Blog post saved:', response.data);
      // Optionally, redirect or show a success message
    } catch (err) {
      setError('Failed to save the blog post.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Blog Editor</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-semibold"
        />
      </div>
      <PlateEditor value={content} onChange={setContent} />
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={() => handleSave('draft')} disabled={loading}>
          {loading ? 'Saving...' : 'Save Draft'}
        </Button>
        <Button onClick={() => handleSave('published')} disabled={loading}>
          {loading ? 'Publishing...' : 'Publish'}
        </Button>
      </div>
    </div>
  );
};

export default EditorPage;
