import FormControl, { FormControlProps } from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select';

export interface SelectOption<T = string | number> {
  label: string;
  value: T;
  disabled?: boolean;
}

export interface AppSelectProps<T = string | number> extends Omit<SelectProps<T>, 'onChange'> {
  label: string;
  options: SelectOption<T>[];
  helperText?: string;
  onChange?: (value: T) => void;
  formControlProps?: FormControlProps;
}

export const AppSelect = <T extends string | number>({
  label,
  options,
  value,
  helperText,
  error,
  disabled,
  onChange,
  formControlProps,
  size = 'small',
  fullWidth = true,
  ...rest
}: AppSelectProps<T>) => {
  const labelId = `select-label-${label.replace(/\s+/g, '-').toLowerCase()}`;

  const handleChange = (e: SelectChangeEvent<T>) => {
    onChange?.(e.target.value as T);
  };

  return (
    <FormControl
      size={size}
      fullWidth={fullWidth}
      error={error}
      disabled={disabled}
      {...formControlProps}
    >
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        label={label}
        value={value}
        onChange={handleChange}
        {...rest}
      >
        {options.map((opt) => (
          <MenuItem key={String(opt.value)} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
