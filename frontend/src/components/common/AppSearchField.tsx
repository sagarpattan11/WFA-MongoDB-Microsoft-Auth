import { Search, X } from 'lucide-react';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import React from 'react';

export interface AppSearchFieldProps extends Omit<TextFieldProps, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

export const AppSearchField: React.FC<AppSearchFieldProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search records...',
  size = 'small',
  fullWidth = true,
  ...rest
}) => {
  return (
    <TextField
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      size={size}
      fullWidth={fullWidth}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search size={18} />
          </InputAdornment>
        ),
        endAdornment: value ? (
          <InputAdornment position="end">
            <IconButton
              size="small"
              aria-label="Clear search query"
              onClick={() => {
                onChange('');
                onClear?.();
              }}
            >
              <X size={16} />
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      {...rest}
    />
  );
};
