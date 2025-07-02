// components/Content.tsx

import React from 'react';

import { Container, Text } from '@nextui-org/react';



export function Content() {

  return (

    <Container css={{ textAlign: 'center', padding: '2rem', maxWidth: 600 }}>

      <Text h1 size={36} css={{ mb: '1.5rem' }}>

        Selamat Datang di CV. Lantana Jaya Digital

      </Text>

      <Text size={18} css={{ mb: '1.2rem' }}>

        CV. Lantana Jaya Digital adalah perusahaan yang bergerak di bidang layanan digital printing, percetakan, dan solusi kreatif untuk kebutuhan promosi bisnis Anda. Kami melayani pembuatan berbagai produk seperti spanduk, banner, kartu nama, undangan, stiker, dan masih banyak lagi dengan kualitas terbaik dan harga bersaing.

      </Text>

      <Text size={16}>

        Komitmen kami adalah memberikan pelayanan profesional, hasil cetak berkualitas, serta solusi kreatif yang membantu bisnis Anda berkembang. Terima kasih telah mempercayakan kebutuhan digital printing Anda kepada kami.

      </Text>

    </Container>

  );

}