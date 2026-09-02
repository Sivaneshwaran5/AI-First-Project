import React, { useState } from 'react';
import { meetingsAPI } from '../services/api';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Calendar,
  User,
  AlertCircle,
  Clock,
  Sparkles,
  Filter,
  CheckCircle2
} from 'lucide-react';

export default function ActionItemsList({ meetingId, initialItems = [], onItemsUpdated }) {
  const [items, setItems] = useState(initialItems);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'PENDING' | 'COMPLETED' | 'HIGH'
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newAssignee, setNewAssignee] = useState('Alex Carter');
  const [newPriority, setNewPriority] = useState('High');
  const [newDueDate, setNewDueDate] = useState('');
  const [loadingItemId, setLoadingItemId] = useState(null);

  // Sync state if initialItems change
  React.useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleToggleCompleted = async (item) => {
    const updatedStatus = !item.completed;
    setLoadingItemId(item.id || item._id);

    // Optimistic UI update
    const prevItems = [...items];
    const newItems = items.map((i) =>
      (i.id === item.id || i._id === item._id) ? { ...i, completed: updatedStatus } : i
    );
    setItems(newItems);

    try {
      const res = await meetingsAPI.updateActionItem(meetingId, item.id || item._id, {
        completed: updatedStatus,
      });
      if (res.data.success && res.data.data) {
        setItems(res.data.data);
        if (onItemsUpdated) onItemsUpdated(res.data.data);
      }
    } catch (err) {
      console.error('Failed to update action item:', err);
      setItems(prevItems); // Rollback
    } finally {
      setLoadingItemId(null);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    try {
      const res = await meetingsAPI.addActionItem(meetingId, {
        task: newTask.trim(),
        assignee: newAssignee,
        priority: newPriority,
        dueDate: newDueDate || undefined,
      });

      if (res.data.success && res.data.data) {
        setItems(res.data.data);
        if (onItemsUpdated) onItemsUpdated(res.data.data);
        setNewTask('');
        setIsAdding(false);
      }
    } catch (err) {
      console.error('Failed to add action item:', err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    const prevItems = [...items];
    setItems(items.filter((i) => i.id !== itemId && i._id !== itemId));

    try {
      const res = await meetingsAPI.deleteActionItem(meetingId, itemId);
      if (res.data.success && res.data.data) {
        setItems(res.data.data);
        if (onItemsUpdated) onItemsUpdated(res.data.data);
      }
    } catch (err) {
      console.error('Failed to delete item:', err);
      setItems(prevItems);
    }
  };

  const filteredItems = items.filter((item) => {
    if (filter === 'PENDING') return !item.completed;
    if (filter === 'COMPLETED') return item.completed;
    if (filter === 'HIGH') return item.priority === 'High';
    return true;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            HIGH
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            LOW
          </span>
        );
    }
  };

  const completedCount = items.filter((i) => i.completed).length;

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-brand-400" />
              <span>AI-Extracted Action Items & Follow-ups</span>
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
              {completedCount}/{items.length} Done
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Tasks, commitments, and deadlines automatically identified from conversation audio
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          { id: 'ALL', label: `All Tasks (${items.length})` },
          { id: 'PENDING', label: `Pending (${items.length - completedCount})` },
          { id: 'HIGH', label: `High Priority (${items.filter((i) => i.priority === 'High').length})` },
          { id: 'COMPLETED', label: `Completed (${completedCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filter === tab.id
                ? 'bg-dark-800 text-brand-300 border border-brand-500/40'
                : 'text-slate-400 hover:text-white bg-dark-900/60 border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Add New Task Form */}
      {isAdding && (
        <form
          onSubmit={handleAddItem}
          className="p-4 rounded-2xl bg-dark-900 border border-brand-500/30 space-y-3 animate-in fade-in duration-200"
        >
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Task Description</label>
            <input
              type="text"
              required
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="e.g. Schedule follow-up technical architecture call"
              className="w-full px-3 py-2 rounded-xl bg-dark-800 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assignee</label>
              <input
                type="text"
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
                placeholder="e.g. Alex Carter"
                className="w-full px-3 py-1.5 rounded-xl bg-dark-800 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-dark-800 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-dark-800 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-lg bg-dark-800 text-slate-400 text-xs hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold"
            >
              Save Action Item
            </button>
          </div>
        </form>
      )}

      {/* Items List */}
      <div className="space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-dark-900/40 border border-white/5 text-slate-500 text-xs">
            No action items found for this filter.
          </div>
        ) : (
          filteredItems.map((item) => {
            const itemId = item.id || item._id;
            const isCompleted = Boolean(item.completed);

            return (
              <div
                key={itemId}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-3 group ${
                  isCompleted
                    ? 'bg-dark-900/40 border-white/5 opacity-60'
                    : 'bg-dark-900/90 border-white/10 hover:border-brand-500/30'
                }`}
              >
                {/* Left: Checkbox & Task info */}
                <div className="flex items-start gap-3 flex-1">
                  <button
                    type="button"
                    onClick={() => handleToggleCompleted(item)}
                    className="mt-0.5 text-slate-400 hover:text-brand-400 transition-colors"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Square className="w-5 h-5 hover:text-brand-300" />
                    )}
                  </button>

                  <div className="space-y-1.5">
                    <p
                      className={`text-xs sm:text-sm font-medium leading-relaxed ${
                        isCompleted ? 'line-through text-slate-500' : 'text-slate-100'
                      }`}
                    >
                      {item.task}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                      {getPriorityBadge(item.priority)}

                      {item.assignee && (
                        <span className="flex items-center gap-1 bg-dark-800 px-2 py-0.5 rounded text-slate-300">
                          <User className="w-3 h-3 text-brand-400" />
                          <span>{item.assignee}</span>
                        </span>
                      )}

                      {item.dueDate && (
                        <span className="flex items-center gap-1 bg-dark-800 px-2 py-0.5 rounded text-slate-300">
                          <Calendar className="w-3 h-3 text-cyan-400" />
                          <span>
                            {new Date(item.dueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Delete Action */}
                <button
                  type="button"
                  onClick={() => handleDeleteItem(itemId)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all"
                  title="Remove Action Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
