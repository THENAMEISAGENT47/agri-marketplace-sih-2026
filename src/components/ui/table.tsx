import React from 'react'
import { cn } from '@/lib/utils'

interface TableProps {
  children: React.ReactNode
  className?: string
  compact?: boolean
  headers?: string[]
}

export const Table: React.FC<TableProps> = ({ children, className = '', compact = false, headers }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn('w-full text-left', compact ? 'text-xs' : 'text-sm', className)}>
        {headers && (
          <thead className="border-b border-border">
            <tr>
              {headers.map((header, i) => (
                <th key={i} className="px-4 py-3 text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider bg-neutral-100/70 dark:bg-neutral-900/80 whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        {headers ? (
          <tbody className="divide-y divide-border">{children}</tbody>
        ) : (
          children
        )}
      </table>
    </div>
  )
}

export const TableHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <thead className={cn('border-b border-border', className)}>
      {children}
    </thead>
  )
}

export const TableBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return <tbody className={cn('divide-y divide-border', className)}>{children}</tbody>
}

export const TableRow: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => {
  return (
    <tr
      className={cn(
        'border-b border-border last:border-b-0 transition-colors',
        onClick && 'cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/60',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

export const TableCell: React.FC<{ children: React.ReactNode; className?: string; header?: boolean }> = ({ children, className = '', header = false }) => {
  const Tag = header ? 'th' : 'td'
  return (
    <Tag
      className={cn(
        'px-4 py-3 whitespace-nowrap',
        header
          ? 'text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider bg-neutral-100/70 dark:bg-neutral-900/80'
          : 'text-foreground',
        className
      )}
    >
      {children}
    </Tag>
  )
}