import Checkbox, { CheckboxProps } from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import React from 'react';

export interface AppCheckboxProps extends CheckboxProps {
  label?: string;
}

export const AppCheckbox: React.FC<AppCheckboxProps> = ({ label, ...rest }) => {
  if (!label) {
    return <Checkbox size="small" {...rest} />;
  }

  return <FormControlLabel control={<Checkbox size="small" {...rest} />} label={label} />;
};
