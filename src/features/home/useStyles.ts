import { useMemo } from 'react';
import { useTheme } from '@config/theme';
import { createStyles } from './styles';

export const useStyles = () => {
  const { theme } = useTheme();

  return useMemo(() => createStyles(theme), [theme]);
};
