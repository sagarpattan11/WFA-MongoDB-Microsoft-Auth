import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';
import { EmptyState } from '../feedback/EmptyState';
import { ErrorState } from '../feedback/ErrorState';
import { TableSkeleton } from '../feedback/SkeletonLoaders';
import { AppPagination } from './AppPagination';

export interface ColumnDef<T> {
  id: string;
  header: string;
  headerTooltip?: string;
  accessor?: (row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string | number;
  maxWidth?: string | number;
  truncate?: boolean;
  tooltip?: boolean | ((row: T) => React.ReactNode);
}

export interface DataTableShellProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  page?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  keyExtractor?: (row: T, index: number) => string | number;
  onRowClick?: (row: T) => void;
}

export const DataTableShell = <T extends Record<string, unknown>>({
  columns,
  data,
  loading = false,
  error = null,
  onRetry,
  emptyTitle,
  emptyDescription,
  page,
  totalPages,
  totalItems,
  pageSize,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  keyExtractor,
  onRowClick,
}: DataTableShellProps<T>) => {
  if (loading) {
    return <TableSkeleton rows={5} columns={columns.length} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  const renderCellContent = (rawContent: React.ReactNode, col: ColumnDef<T>, row: T) => {
    // Custom tooltip function provided in column definition
    if (typeof col.tooltip === 'function') {
      const customTooltip = col.tooltip(row);
      if (customTooltip) {
        return (
          <Tooltip title={customTooltip} arrow placement="top" enterDelay={200} disableInteractive>
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                maxWidth: col.maxWidth || 240,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                verticalAlign: 'bottom',
                cursor: 'default',
              }}
            >
              {rawContent}
            </Box>
          </Tooltip>
        );
      }
    }

    // Auto tooltip for string/numeric cell content that exceeds standard length or has explicit truncate/maxWidth
    if (typeof rawContent === 'string' || typeof rawContent === 'number') {
      const text = String(rawContent);
      const isLongText = text.length > 18 || col.truncate || Boolean(col.maxWidth) || col.tooltip === true;

      if (isLongText) {
        return (
          <Tooltip title={text} arrow placement="top" enterDelay={200} disableInteractive>
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                maxWidth: col.maxWidth || 240,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                verticalAlign: 'bottom',
                cursor: 'default',
              }}
            >
              {text}
            </Box>
          </Tooltip>
        );
      }
      return text;
    }

    return rawContent;
  };

  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="Enterprise Data Table">
          <TableHead>
            <TableRow>
              {columns.map((col) => {
                const headerContent = (
                  <TableCell
                    key={col.id}
                    align={col.align || 'left'}
                    sx={{ width: col.width, fontWeight: 600, bgcolor: 'background.paper' }}
                  >
                    {col.headerTooltip ? (
                      <Tooltip title={col.headerTooltip} arrow placement="top" enterDelay={200}>
                        <Box component="span" sx={{ cursor: 'help', borderBottom: '1px dotted currentColor' }}>
                          {col.header}
                        </Box>
                      </Tooltip>
                    ) : (
                      col.header
                    )}
                  </TableCell>
                );
                return headerContent;
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => {
              const rowKey = keyExtractor ? keyExtractor(row, index) : index;
              return (
                <TableRow
                  key={rowKey}
                  hover={Boolean(onRowClick)}
                  onClick={() => onRowClick?.(row)}
                  sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {columns.map((col) => {
                    const rawContent = col.accessor ? col.accessor(row) : (row[col.id] as React.ReactNode);
                    return (
                      <TableCell key={col.id} align={col.align || 'left'}>
                        {renderCellContent(rawContent, col, row)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {page !== undefined && totalPages !== undefined && onPageChange && (
        <Box sx={{ px: 2, py: 1, borderTop: 1, borderColor: 'divider' }}>
          <AppPagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            pageSizeOptions={pageSizeOptions}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </Box>
      )}
    </Paper>
  );
};
