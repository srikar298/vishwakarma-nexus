import { SocialIcon } from 'react-social-icons';
import { SOCIAL_LINKS } from '@/shared/constants/social-links';

interface SocialLinksProps {
  size?: number;
  className?: string;
  iconClassName?: string;
  showLabel?: boolean;
}

export const SocialLinks = ({ 
  size = 28, 
  className = "flex gap-4 items-center",
  iconClassName = "hover:scale-110 transition-transform shadow-sm rounded-full",
  showLabel = false
}: SocialLinksProps) => {
  return (
    <div className={className}>
      {showLabel && (
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mr-2">
          Follow Us
        </span>
      )}
      <SocialIcon 
        url={SOCIAL_LINKS.facebook} 
        target="_blank" 
        rel="noreferrer" 
        className={iconClassName} 
        style={{ height: size, width: size }} 
      />
      <SocialIcon 
        url={SOCIAL_LINKS.x} 
        target="_blank" 
        rel="noreferrer" 
        className={iconClassName} 
        style={{ height: size, width: size }} 
      />
      <SocialIcon 
        url={SOCIAL_LINKS.whatsapp} 
        target="_blank" 
        rel="noreferrer" 
        className={iconClassName} 
        style={{ height: size, width: size }} 
      />
      <SocialIcon 
        url={SOCIAL_LINKS.instagram} 
        target="_blank" 
        rel="noreferrer" 
        className={iconClassName} 
        style={{ height: size, width: size }} 
      />
    </div>
  );
};
