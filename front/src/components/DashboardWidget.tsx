import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';

interface DashboardWidgetProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onRemove?: () => void;
}

export function DashboardWidget({ id, title, children, onRemove }: DashboardWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow-lg overflow-hidden touch-manipulation"
    >
      <div
        {...attributes}
        {...listeners}
        className="bg-gray-50 p-4 flex justify-between items-center cursor-move select-none"
      >
        <div className="flex items-center gap-2">
          <GripVertical className="w-5 h-5 text-gray-400" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
            {title}
          </h3>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Remove widget"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}