import {Input, Link, Navbar, Text, Button} from '@nextui-org/react';
import React, {useState, useEffect} from 'react';
import {SearchIcon} from '../icons/searchicon';
import {Box} from '../styles/box';
import {BurguerButton} from './burguer-button';
import {useRouter} from 'next/router';

interface Props {
   children: React.ReactNode;
}

export const NavbarWrapper = ({children}: Props) => {
   const router = useRouter();
   const [user, setUser] = useState<any>(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      if (typeof window !== 'undefined') {
         const userStr = localStorage.getItem('user_data');
         if (userStr) {
            try {
               setUser(JSON.parse(userStr));
            } catch {}
         }
         setIsLoading(false);
      }
   }, []);

   const collapseItems = [
      'Profile',
      'Dashboard',
      'Activity',
      'Analytics',
      'System',
      'Deployments',
      'My Settings',
      'Team Settings',
      'Help & Feedback',
      'Log Out',
   ];
   return (
      <Box
         css={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
            overflowY: 'auto',
            overflowX: 'hidden',
         }}
      >
         <Navbar
            isBordered
            css={{
               background: '#fff',
               borderBottom: '1px solid $border',
               justifyContent: 'center',
               width: '100%',
               '@md': {
                  justifyContent: 'center',
               },
               '& .nextui-navbar-container': {
                  border: 'none',
                  maxWidth: '100%',
                  gap: '$6',
                  background: 'transparent',
                  '@md': {
                     justifyContent: 'center',
                  },
               },
            }}
         >
            <Navbar.Content
               css={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  pointerEvents: 'auto',
               }}
            >
               <Text
                 b
                 size={28}
                 css={{
                   background: 'linear-gradient(135deg, #800000 0%, #B22222 50%, #DC143C 100%)',
                   backgroundClip: 'text',
                   WebkitBackgroundClip: 'text',
                   WebkitTextFillColor: 'transparent',
                   color: '#800000',
                   letterSpacing: '3px',
                   fontFamily: 'Poppins, Montserrat, Inter, Arial, sans-serif',
                   textAlign: 'center',
                   width: 'fit-content',
                   userSelect: 'none',
                   pointerEvents: 'auto',
                   fontWeight: '900',
                   textTransform: 'uppercase',
                   position: 'relative',
                   '&:hover': {
                     transform: 'scale(1.05)',
                     filter: 'drop-shadow(0 4px 8px rgba(128,0,0,0.3))',
                   },
                   transition: 'all 0.3s ease',
                   textShadow: '0 2px 4px rgba(128,0,0,0.1)',
                 }}
               >
                 LantaOrderSpace
               </Text>
            </Navbar.Content>
            


            <Navbar.Content showIn="md" css={{ alignItems: 'center', gap: '$8' }}>
               <BurguerButton />
            </Navbar.Content>
            <Navbar.Content
               hideIn={'md'}
               css={{
                  width: '100%',
               }}
            >
               <Input
                  clearable
                  contentLeft={
                     <SearchIcon
                        fill="var(--nextui-colors-accents6)"
                        size={16}
                     />
                  }
                  contentLeftStyling={false}
                  css={{
                     'w': '100%',
                     'transition': 'all 0.2s ease',
                     '@xsMax': {
                        w: '100%',
                        // mw: '300px',
                     },
                     '& .nextui-input-content--left': {
                        h: '100%',
                        ml: '$4',
                        dflex: 'center',
                     },
                  }}
                  placeholder="Search..."
               />
            </Navbar.Content>

            <Navbar.Collapse>
               {collapseItems.map((item, index) => (
                  <Navbar.CollapseItem
                     key={item}
                     activeColor="secondary"
                     css={{
                        color:
                           index === collapseItems.length - 1 ? '$error' : '',
                     }}
                     isActive={index === 2}
                  >
                     <Link
                        color="inherit"
                        css={{
                           minWidth: '100%',
                        }}
                        href="#"
                     >
                        {item}
                     </Link>
                  </Navbar.CollapseItem>
               ))}
            </Navbar.Collapse>
         </Navbar>
         {children}
      </Box>
   );
};