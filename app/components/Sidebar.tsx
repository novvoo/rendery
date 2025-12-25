"use client";

import {
    Brush,
    Description,
    Edit,
    Help,
    Home,
    LibraryBooks,
    Settings
} from '@mui/icons-material';
import {
    alpha,
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useTheme
} from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const drawerWidth = 240;

const menuItems = [
  { text: '首页', icon: <Home />, path: '/' },
  { text: '编辑器', icon: <Edit />, path: '/editor' },
  { text: '示例模板', icon: <LibraryBooks />, path: '/examples' },
];

const secondaryMenuItems = [
  { text: '主题预览', icon: <Brush />, path: '/theme-preview' },
  { text: '文档', icon: <Description />, path: '/docs' },
];

const bottomMenuItems = [
  { text: '设置', icon: <Settings />, path: '/settings' },
  { text: '帮助', icon: <Help />, path: '/help' },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
  };

  const isActive = (path: string) => pathname === path;

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // 提高移动端性能
      }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: `1px solid ${alpha(theme.palette.divider, 0.12)}`,
          backgroundColor: alpha(theme.palette.background.paper, 0.98),
          boxShadow: theme.shadows[2],
          marginTop: '64px',
          height: 'calc(100vh - 64px)',
        },
      }}
    >
      <Box sx={{ overflow: 'auto', pt: 2 }}>
        <List sx={{ px: 1 }}>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive(item.path)}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: 2,
                  minHeight: 48,
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.16),
                    },
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.main,
                    },
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.action.hover, 0.04),
                    borderRadius: 2,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive(item.path) ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Divider sx={{ mx: 2, my: 2 }} />
        
        <List sx={{ px: 1 }}>
          <ListItem sx={{ py: 0.5 }}>
            <Typography 
              variant="overline" 
              sx={{ 
                fontWeight: 600, 
                color: theme.palette.text.secondary,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              工具
            </Typography>
          </ListItem>
          {secondaryMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive(item.path)}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: 2,
                  minHeight: 44,
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.16),
                    },
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.main,
                    },
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.action.hover, 0.04),
                    borderRadius: 2,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive(item.path) ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        
        <Divider sx={{ mx: 2, my: 2 }} />
        
        <List sx={{ px: 1, pb: 1 }}>
          {bottomMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={isActive(item.path)}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: 2,
                  minHeight: 44,
                  '&.Mui-selected': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.16),
                    },
                    '& .MuiListItemIcon-root': {
                      color: theme.palette.primary.main,
                    },
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.action.hover, 0.04),
                    borderRadius: 2,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: isActive(item.path) ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}
