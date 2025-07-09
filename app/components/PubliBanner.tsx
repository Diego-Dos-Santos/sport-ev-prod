import Image from 'next/image';
import React from 'react';
import Link from 'next/link';

interface PubliBannerProps {
  bannerNumber: number;
  link?: string;
}

const PubliBanner: React.FC<PubliBannerProps> = ({ bannerNumber, link }) => {
  const bannerContent = (
    <div className="px-4 md:px-12 my-8">
      <div className="relative w-full h-[200px] md:h-[300px]">
        <Image
          src={`/images/publi-banners/PubliBanner${bannerNumber}.jpg`}
          alt="Advertisement Banner"
          fill
          className="object-cover rounded-md"
          priority
        />
      </div>
    </div>
  );

  if (link) {
    return (
      <Link href={link} target="_blank" className="block hover:opacity-90 transition-opacity">
        {bannerContent}
      </Link>
    );
  }

  return bannerContent;
};

export default PubliBanner; 