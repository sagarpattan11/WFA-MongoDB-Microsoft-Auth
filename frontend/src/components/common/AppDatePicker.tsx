import { Calendar } from 'lucide-react';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import React from 'react';

export interface AppDatePickerProps extends Omit<TextFieldProps, 'type' | 'onChange'> {
  value: string;
  onChange: (date: string) => void;
  label: string;
}

export const AppDatePicker: React.FC<AppDatePickerProps> = ({
  value,
  onChange,
  label,
  size = 'small',
  fullWidth = true,
  ...rest
}) => {
  return (
    <TextField
      type="date"
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      size={size}
      fullWidth={fullWidth}
      InputLabelProps={{ shrink: true }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Calendar size={16} />
          </InputAdornment>
        ),
      }}
      {...rest}
    />
  );
};
