import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs, { TabsProps } from '@mui/material/Tabs';
import React from 'react';

export interface TabItem {
  label: string;
  value: string | number;
  icon?: React.ReactElement;
  disabled?: boolean;
}

export interface AppTabsProps extends Omit<TabsProps, 'onChange'> {
  tabs: TabItem[];
  value: string | number;
  onChange: (value: string | number) => void;
}

export const AppTabs: React.FC<AppTabsProps> = ({ tabs, value, onChange, ...rest }) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs
        value={value}
        onChange={(_, val) => onChange(val)}
        variant="scrollable"
        scrollButtons="auto"
        {...rest}
      >
        {tabs.map((tab) => (
          <Tab
            key={String(tab.value)}
            label={tab.label}
            value={tab.value}
            icon={tab.icon}
            iconPosition="start"
            disabled={tab.disabled}
          />
        ))}
      </Tabs>
    </Box>
  );
};
