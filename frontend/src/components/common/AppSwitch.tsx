import FormControlLabel from '@mui/material/FormControlLabel';
import Radio, { RadioProps } from '@mui/material/Radio';
import Switch, { SwitchProps } from '@mui/material/Switch';
import React from 'react';

export interface AppRadioProps extends RadioProps {
  label?: string;
}

export const AppRadio: React.FC<AppRadioProps> = ({ label, ...rest }) => {
  if (!label) {
    return <Radio size="small" {...rest} />;
  }

  return <FormControlLabel control={<Radio size="small" {...rest} />} label={label} />;
};

export interface AppSwitchProps extends SwitchProps {
  label?: string;
}

export const AppSwitch: React.FC<AppSwitchProps> = ({ label, ...rest }) => {
  if (!label) {
    return <Switch size="small" {...rest} />;
  }

  return <FormControlLabel control={<Switch size="small" {...rest} />} label={label} />;
};
