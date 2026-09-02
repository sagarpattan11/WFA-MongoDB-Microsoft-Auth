import TextField, { TextFieldProps } from '@mui/material/TextField';
import { forwardRef } from 'react';

export type AppTextFieldProps = TextFieldProps;

export const AppTextField = forwardRef<HTMLDivElement, AppTextFieldProps>(
  ({ variant = 'outlined', size = 'small', fullWidth = true, ...rest }, ref) => {
    return <TextField ref={ref} variant={variant} size={size} fullWidth={fullWidth} {...rest} />;
  }
);

AppTextField.displayName = 'AppTextField';
