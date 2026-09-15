import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useEffect, useState } from 'react';

export interface AppPaginationProps {
  totalItems?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export const AppPagination: React.FC<AppPaginationProps> = ({
  totalItems,
  pageSize = 10,
  pageSizeOptions = [5, 10, 20, 50, 100],
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [inputPage, setInputPage] = useState<string>(String(currentPage));

  useEffect(() => {
    setInputPage(String(currentPage));
  }, [currentPage]);

  const handleJumpToPage = () => {
    const target = parseInt(inputPage, 10);
    if (!isNaN(target) && target >= 1 && target <= totalPages) {
      if (target !== currentPage) {
        onPageChange(target);
      }
    } else {
      setInputPage(String(currentPage));
    }
  };

  const startIdx = totalItems && totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endIdx = totalItems ? Math.min(currentPage * pageSize, totalItems) : currentPage * pageSize;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: { xs: 1.5, md: 2 },
        py: 1,
        width: '100%',
      }}
    >
      {/* 1. LEFT SIDE: Rows Per Page Dropdown & Record Counter */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems="center"
        justifyContent={{ xs: 'center', md: 'flex-start' }}
        spacing={1.5}
        sx={{ width: { xs: '100%', md: 'auto' } }}
      >
        {onPageSizeChange && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
              Rows per page:
            </Typography>
            <Select
              size="small"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              sx={{
                height: 30,
                fontSize: '0.825rem',
                bgcolor: 'background.paper',
                '& .MuiSelect-select': { py: 0.3, px: 1.2 },
              }}
            >
              {pageSizeOptions.map((option) => (
                <MenuItem key={option} value={option} sx={{ fontSize: '0.85rem' }}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Stack>
        )}

        {totalItems !== undefined && (
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap', fontSize: '0.825rem' }}>
            {totalItems > 0 ? `Showing ${startIdx}–${endIdx} of ${totalItems}` : '0 entries'}
          </Typography>
        )}
      </Stack>

      {/* 2. MIDDLE: Left & Right Arrows + Page Numbers */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: { xs: '100%', md: 'auto' },
          overflowX: 'auto',
          py: 0.5,
        }}
      >
        <Pagination
          count={Math.max(1, totalPages)}
          page={currentPage}
          onChange={(_, page) => onPageChange(page)}
          color="primary"
          shape="rounded"
          size={isMobile ? 'small' : isTablet ? 'small' : 'medium'}
          showFirstButton={!isMobile}
          showLastButton={!isMobile}
          siblingCount={isMobile ? 0 : 1}
          boundaryCount={1}
          sx={{
            '& .MuiPagination-ul': {
              flexWrap: 'nowrap',
              justifyContent: 'center',
            },
            '& .MuiPaginationItem-root': {
              fontWeight: 500,
              minWidth: { xs: 28, sm: 32 },
              height: { xs: 28, sm: 32 },
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              margin: '0 2px',
            },
          }}
        />
      </Box>

      {/* 3. RIGHT SIDE: Direct Page Input Selector */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={{ xs: 'center', md: 'flex-end' }}
        spacing={1}
        sx={{ width: { xs: '100%', md: 'auto' } }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
          Go to page:
        </Typography>
        <TextField
          size="small"
          type="number"
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleJumpToPage();
            }
          }}
          inputProps={{
            min: 1,
            max: Math.max(1, totalPages),
            style: {
              textAlign: 'center',
              width: 38,
              padding: '4px 6px',
              fontSize: '0.825rem',
            },
          }}
          sx={{
            width: 54,
            '& .MuiOutlinedInput-root': {
              height: 30,
              bgcolor: 'background.paper',
            },
          }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
          of {Math.max(1, totalPages)}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={handleJumpToPage}
          disabled={!inputPage || Number(inputPage) < 1 || Number(inputPage) > totalPages}
          sx={{
            minWidth: 38,
            height: 30,
            py: 0.2,
            px: 1,
            textTransform: 'none',
            fontSize: '0.78rem',
            fontWeight: 600,
          }}
        >
          Go
        </Button>
      </Stack>
    </Box>
  );
};

