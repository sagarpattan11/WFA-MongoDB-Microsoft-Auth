import Box from '@mui/material/Box';
import Tooltip, { TooltipProps } from '@mui/material/Tooltip';
import Typography, { TypographyProps } from '@mui/material/Typography';
import React from 'react';

export interface AutoTooltipTextProps extends Omit<TypographyProps, 'children'> {
  text: string | number;
  tooltipText?: React.ReactNode;
  maxLength?: number;
  maxWidth?: string | number;
  placement?: TooltipProps['placement'];
  alwaysShowTooltip?: boolean;
}

/**
 * Reusable Universal Auto-Tooltip Text Component
 * Automatically truncates text when it exceeds maxLength or maxWidth and shows a rich tooltip on hover.
 */
export const AutoTooltipText: React.FC<AutoTooltipTextProps> = ({
  text,
  tooltipText,
  maxLength = 22,
  maxWidth = 240,
  placement = 'top',
  alwaysShowTooltip = false,
  sx,
  ...typographyProps
}) => {
  const stringVal = String(text ?? '');
  const shouldShowTooltip = alwaysShowTooltip || Boolean(tooltipText) || stringVal.length > maxLength;

  const content = (
    <Typography
      component="span"
      {...typographyProps}
      sx={{
        display: 'inline-block',
        maxWidth,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        verticalAlign: 'bottom',
        ...sx,
      }}
    >
      {stringVal}
    </Typography>
  );

  if (!shouldShowTooltip) {
    return content;
  }

  return (
    <Tooltip
      title={tooltipText || stringVal}
      arrow
      placement={placement}
      enterDelay={200}
      disableInteractive
    >
      <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', cursor: 'default' }}>
        {content}
      </Box>
    </Tooltip>
  );
};
