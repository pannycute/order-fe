import {Card, Text} from '@nextui-org/react';
import React from 'react';
import {Community} from '../icons/community';
import {Box} from '../styles/box';
import {Flex} from '../styles/flex';

export const CardBalance3 = () => {
   return (
      <Card
         css={{
            mw: '375px',
            bg: '$green600',
            borderRadius: '$xl',
            px: '$6',
         }}
      >
         <Card.Body>
            <Box css={{paddingTop: 40, paddingBottom: 40}}>
               <Flex css={{gap: '$5'}}>
                  <Community />
                  <Flex direction={'column'}>
                     <Text span css={{color: 'white'}}>
                        Balance Insurance
                     </Text>
                     <Text span css={{color: 'white'}} size={'$xs'}>
                        1311 Cars
                     </Text>
                  </Flex>
               </Flex>
               <Flex css={{gap: '$6', py: '$4'}} align={'center'}>
                  <Text
                     span
                     size={'$xl'}
                     css={{color: 'white'}}
                     weight={'semibold'}
                  >
                     $3,910
                  </Text>
                  <Text span css={{color: '$red600'}} size={'$xs'}>
                     + 4.5%
                  </Text>
               </Flex>
               <Flex css={{gap: '$12'}} align={'center'}>
                  <Box>
                     <Text
                        span
                        size={'$xs'}
                        css={{color: '$red600'}}
                        weight={'semibold'}
                     >
                        {'↓'}
                     </Text>
                     <Text span size={'$xs'} css={{color: '$white'}}>
                        100,930 USD
                     </Text>
                  </Box>
                  <Box>
                     <Text
                        span
                        size={'$xs'}
                        css={{color: '$red600'}}
                        weight={'semibold'}
                     >
                        {'↑'}
                     </Text>
                     <Text span size={'$xs'} css={{color: '$white'}}>
                        54,120 USD
                     </Text>
                  </Box>
                  <Box>
                     <Text
                        span
                        size={'$xs'}
                        css={{color: '$green600'}}
                        weight={'semibold'}
                     >
                        {'⭐'}
                     </Text>
                     <Text span size={'$xs'} css={{color: '$white'}}>
                        125 VIP
                     </Text>
                  </Box>
               </Flex>
            </Box>
         </Card.Body>
      </Card>
   );
};