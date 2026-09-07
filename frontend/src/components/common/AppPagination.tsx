import Pagination, { PaginationProps } from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';

export interface AppPaginationProps extends PaginationProps {
  totalItems?: number;
  pageSize?: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const AppPagination: React.FC<AppPaginationProps> = ({
  totalItems,
  pageSize = 10,
  currentPage,
  totalPages,
  onPageChange,
  ...rest
}) => {
  const startIdx = (currentPage - 1) * pageSize + 1;
  const endIdx = totalItems ? Math.min(currentPage * pageSize, totalItems) : currentPage * pageSize;

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{ pt: 2, pb: 1 }}
    >
      {totalItems !== undefined && (
        <Typography variant="body2" color="text.secondary">
          Showing {startIdx}–{endIdx} of {totalItems} entries
        </Typography>
      )}

      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => onPageChange(page)}
        color="primary"
        shape="rounded"
        size="small"
        {...rest}
      />
    </Stack>
  );
};
