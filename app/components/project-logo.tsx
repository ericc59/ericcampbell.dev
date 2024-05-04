import Image from 'next/image';

export default function ProjectLogo({ src, alt }) {
  return (
    <Image
      alt={alt}
      src={src}
      width={512}
      height={512}
      sizes="(max-width: 768px) 213px, 33vw"
      priority
      className="object-contain h-8 w-auto "
    />
  );
}
