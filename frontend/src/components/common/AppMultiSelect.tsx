import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import FormControl, { FormControlProps } from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select';
import React from 'react';
import { SelectOption } from './AppSelect';

export interface AppMultiSelectProps extends Omit<SelectProps<string[]>, 'onChange' | 'value'> {
  label: string;
  options: SelectOption<string>[];
  value: string[];
  onChange: (value: string[]) => void;
  helperText?: string;
  formControlProps?: FormControlProps;
}

export const AppMultiSelect: React.FC<AppMultiSelectProps> = ({
  label,
  options,
  value = [],
  onChange,
  helperText,
  error,
  disabled,
  size = 'small',
  fullWidth = true,
  formControlProps,
  ...rest
}) => {
  const labelId = `multi-select-label-${label.replace(/\s+/g, '-').toLowerCase()}`;

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const val = event.target.value;
    onChange(typeof val === 'string' ? val.split(',') : val);
  };

  const getOptionLabel = (val: string) => {
    return options.find((o) => o.value === val)?.label || val;
  };

  return (
    <FormControl size={size} fullWidth={fullWidth} error={error} disabled={disabled} {...formControlProps}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((val) => (
              <Chip key={val} label={getOptionLabel(val)} size="small" />
            ))}
          </Box>
        )}
        {...rest}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value} disabled={opt.disabled}>
            <Checkbox checked={value.indexOf(opt.value) > -1} size="small" />
            <ListItemText primary={opt.label} />
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
