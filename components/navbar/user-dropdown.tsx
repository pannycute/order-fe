import {Avatar, Dropdown, Navbar, Text} from '@nextui-org/react';
import React, { Key } from 'react';
import {DarkModeSwitch} from './darkmodeswitch';
import { useRouter } from 'next/router';
import { axiosInstance } from '../../utils/axiosInstance';

export const UserDropdown = () => {
   const router = useRouter();

   const handleAction = async (key: Key) => {
      if (String(key) === 'logout') {
         try {
            await axiosInstance.post('/logout');
         } catch (err) {
            console.error('Logout error:', err);
            // Optional: handle error, e.g., show toast
         } finally {
                    localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
            router.push('/');
         }
      }
   };

   return (
      <Dropdown placement="bottom-right">
         <Navbar.Item>
            <Dropdown.Trigger>
               <Avatar
                  bordered
                  as="button"
                  color="secondary"
                  size="md"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
               />
            </Dropdown.Trigger>
         </Navbar.Item>
         <Dropdown.Menu
            aria-label="User menu actions"
            onAction={handleAction}
         >
            <Dropdown.Item key="profile" css={{height: '$18'}}>
               <Text b color="inherit" css={{d: 'flex'}}>
                  Signed in as
               </Text>
               <Text b color="inherit" css={{d: 'flex'}}>
                  zoey@example.com
               </Text>
            </Dropdown.Item>
            <Dropdown.Item key="settings" withDivider>
               My Settings
            </Dropdown.Item>
            <Dropdown.Item key="team_settings">Team Settings</Dropdown.Item>
            <Dropdown.Item key="analytics" withDivider>
               Analytics
            </Dropdown.Item>
            <Dropdown.Item key="system">System</Dropdown.Item>
            <Dropdown.Item key="configurations">Configurations</Dropdown.Item>
            <Dropdown.Item key="help_and_feedback" withDivider>
               Help & Feedback
            </Dropdown.Item>
            <Dropdown.Item key="logout" withDivider color="error">
               Log Out
            </Dropdown.Item>
            <Dropdown.Item key="switch" withDivider>
               <DarkModeSwitch />
            </Dropdown.Item>
         </Dropdown.Menu>
      </Dropdown>
   );
};
