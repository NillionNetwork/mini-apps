import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <p className='mb-4 text-gray-300 italic font-md'>
        Use the L and R arrow keys to navigate between the gallery (Desktop).
      </p>
      <div className='flex'>
        <Link
          href='/'
          className='text-center text-gray-500 text-sm mr-4 underline'
        >
          Home
        </Link>
        <p className='text-center text-gray-500 text-sm'>|</p>
        <Link
          href='/create'
          className='text-center text-gray-500 text-sm mx-4 underline'
        >
          Create
        </Link>
        <p className='text-center text-gray-500 text-sm'>|</p>
        <a
          className='text-center text-gray-500 text-sm underline ml-4'
          href='https://github.com/NillionNetwork/mini-apps'
          target='_blank'
          rel='noopener noreferrer'
        >
          Github
        </a>
        <p className='text-center text-gray-500 text-sm ml-4'>|</p>
        <p className='text-center text-gray-500 text-sm ml-4'>
          Made by:{' '}
          <a
            className='underline mr-2'
            href='https://x.com/crypblizz'
            target='_blank'
            rel='noopener noreferrer'
          >
            crypblizz
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
