'use client';

import {
  Logout,
  Menu as MenuIcon,
  Notifications,
  Person,
  Search,
  Settings
} from '@mui/icons-material';
import {
  alpha,
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface NavbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export default function Navbar({ onMenuClick, sidebarOpen }: NavbarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    handleProfileMenuClose();
  };

  const isProfileMenuOpen = Boolean(anchorEl);
  const isNotificationMenuOpen = Boolean(notificationAnchorEl);

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        zIndex: theme.zIndex.drawer + 1,
        width: '100%',
        ml: 0,
        transition: 'none',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <IconButton
          aria-label="open drawer"
          onClick={onMenuClick}
          edge="start"
          sx={{ 
            mr: 2,
            borderRadius: 2,
            color: 'inherit',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.contrastText, 0.08),
            }
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ 
            display: { xs: 'none', sm: 'block' },
            fontWeight: 600,
            color: 'inherit',
          }}
        >
          RenderY
        </Typography>

        <Box sx={{ flexGrow: 1 }} />
        
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          <Button color="inherit" sx={{ mr: 1 }} onClick={() => router.push('/')}>
            首页
          </Button>
          <Button color="inherit" sx={{ mr: 1 }} onClick={() => router.push('/editor')}>
            编辑器
          </Button>
          <Button color="inherit" sx={{ mr: 2 }} onClick={() => router.push('/examples')}>
            示例
          </Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="搜索">
            <IconButton color="inherit" sx={{ mr: 1 }}>
              <Search />
            </IconButton>
          </Tooltip>

          <Tooltip title="通知">
            <IconButton
              color="inherit"
              onClick={handleNotificationMenuOpen}
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="用户账户">
            <IconButton
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                U
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* 用户菜单 */}
        <Menu
          anchorEl={anchorEl}
          open={isProfileMenuOpen}
          onClose={handleProfileMenuClose}
          onClick={handleProfileMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => handleNavigate('/profile')}>
            <Person sx={{ mr: 2 }} />
            个人资料
          </MenuItem>
          <MenuItem onClick={() => handleNavigate('/settings')}>
            <Settings sx={{ mr: 2 }} />
            设置
          </MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>
            <Logout sx={{ mr: 2 }} />
            退出登录
          </MenuItem>
        </Menu>

        {/* 通知菜单 */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={isNotificationMenuOpen}
          onClose={handleNotificationMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleNotificationMenuClose}>
            <Box>
              <Typography variant="subtitle2">新功能更新</Typography>
              <Typography variant="body2" color="text.secondary">
                添加了新的组件和功能
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleNotificationMenuClose}>
            <Box>
              <Typography variant="subtitle2">系统维护</Typography>
              <Typography variant="body2" color="text.secondary">
                即将进行系统升级
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleNotificationMenuClose}>
            <Box>
              <Typography variant="subtitle2">欢迎使用</Typography>
              <Typography variant="body2" color="text.secondary">
                感谢使用我们的应用
              </Typography>
            </Box>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
