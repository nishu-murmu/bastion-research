import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const createBlogPost = async (req: Request, res: Response) => {
  const { title, content, status } = req.body;

  if (!title || !content || !status) {
    return res.status(400).json({ error: 'Title, content, and status are required' });
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .insert([{ title, content, status }])
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data);
};

export const updateBlogPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, content, status } = req.body;

  if (!title && !content && !status) {
    return res.status(400).json({ error: 'At least one field to update is required' });
  }

  const { data, error } = await supabase
    .from('blog_posts')
    .update({ title, content, status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data || data.length === 0) {
    return res.status(404).json({ error: 'Blog post not found' });
  }

  res.status(200).json(data);
};
