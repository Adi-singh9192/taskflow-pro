import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, MoreVertical, Layout, Trash2 } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Board } from '../types';

export default function Boards() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBoards = async () => {
    try {
      const { data } = await api.get('/boards');
      setBoards(data);
    } catch (error) {
      toast.error('Failed to load boards');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const createBoard = async () => {
    const title = prompt('Enter board name:');
    if (!title) return;
    try {
      await api.post('/boards', { title, description: 'A new project board.' });
      toast.success('Board created!');
      fetchBoards();
    } catch (error) {
      toast.error('Failed to create board');
    }
  };

  const deleteBoard = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this board?')) return;
    try {
      await api.delete(`/boards/${id}`);
      toast.success('Board deleted!');
      fetchBoards();
    } catch (error) {
      toast.error('Failed to delete board');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto space-y-6 pb-20 md:pb-0"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold">Boards</h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">Manage your projects and workspaces</p>
        </div>
        <Button onClick={createBoard} className="gap-2 shrink-0 self-start sm:self-auto">
          <Plus className="w-4 h-4 text-black" />
          New Board
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">Loading...</div>
      ) : boards.length === 0 ? (
        <Card className="p-8 md:p-12 flex flex-col items-center justify-center text-center border-dashed">
          <div className="w-16 h-16 rounded-full bg-[var(--color-hover)] flex items-center justify-center mb-4">
            <Layout className="w-8 h-8 text-[var(--color-text-muted)]" />
          </div>
          <h3 className="text-lg font-medium mb-2">No boards yet</h3>
          <p className="text-[var(--color-text-muted)] max-w-sm mb-6 text-sm">Create your first board to start organizing tasks and tracking progress.</p>
          <Button onClick={createBoard}>Create First Board</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {boards.map((board) => (
            <Card 
              key={board._id} 
              className="p-5 md:p-6 cursor-pointer hover:border-[var(--color-primary)] transition-all group relative overflow-hidden"
              onClick={() => navigate(`/boards/${board._id}`)}
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-[var(--color-hover)] rounded-lg">
                  <Layout className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <button 
                  onClick={(e) => deleteBoard(board._id, e)}
                  className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-hover)] rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-heading font-semibold text-lg mb-1 truncate">{board.title}</h3>
              <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">{board.description || 'No description'}</p>
              <div className="mt-4 md:mt-6 flex items-center text-xs text-[var(--color-text-muted)] font-mono">
                Created {new Date(board.createdAt).toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
