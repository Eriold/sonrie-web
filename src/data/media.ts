import parte1 from '../../assets/Parte_1.mp4?url';
import parte2 from '../../assets/Parte_2.mp4?url';
import parte3 from '../../assets/Parte_3.mp4?url';
import parte4 from '../../assets/Parte_4.mp4?url';
import parte5 from '../../assets/Parte_5.mp4?url';
import foto1 from '../../assets/Parte_1.webp?url';
import foto2 from '../../assets/Parte_2.webp?url';
import foto3 from '../../assets/Parte_3.webp?url';
import foto5 from '../../assets/Parte_5.webp?url';
import foto6 from '../../assets/Parte_6.webp?url';
import poster1 from '../media/posters/Parte_1-poster.webp?url';
import poster2 from '../media/posters/Parte_2-poster.webp?url';
import poster3 from '../media/posters/Parte_3-poster.webp?url';
import poster4 from '../media/posters/Parte_4-poster.webp?url';
import poster5 from '../media/posters/Parte_5-poster.webp?url';
import recepcion from '../../assets/Friendly Mint Receptionist Illustration.png?url';
import espejo from '../../assets/Friendly Anime Dentist with Dental Mirror.png?url';
import modeloDental from '../../assets/Friendly Anime Dentist Demonstrating Dental Model.png?url';
import modeloAparatos from '../../assets/Friendly Orthodontist Presenting Braces Model.png?url';

export const videoUrls: Readonly<Record<string, string>> = {
  'Parte_1.mp4': parte1,
  'Parte_2.mp4': parte2,
  'Parte_3.mp4': parte3,
  'Parte_4.mp4': parte4,
  'Parte_5.mp4': parte5,
};

export const photoUrls: Readonly<Record<string, string>> = {
  'Parte_1.webp': foto1,
  'Parte_2.webp': foto2,
  'Parte_3.webp': foto3,
  'Parte_5.webp': foto5,
  'Parte_6.webp': foto6,
};

export const posterUrls: Readonly<Record<string, string>> = {
  'Parte_1.mp4': poster1,
  'Parte_2.mp4': poster2,
  'Parte_3.mp4': poster3,
  'Parte_4.mp4': poster4,
  'Parte_5.mp4': poster5,
};

export const characterUrls: Readonly<Record<string, string>> = {
  'Friendly Mint Receptionist Illustration.png': recepcion,
  'Friendly Anime Dentist with Dental Mirror.png': espejo,
  'Friendly Anime Dentist Demonstrating Dental Model.png': modeloDental,
  'Friendly Orthodontist Presenting Braces Model.png': modeloAparatos,
};
