'use client';

import toast from 'react-hot-toast';

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

interface Props {
  applicationId: string;
  internshipTitle: string;
}

export default function OfferLetterShare({ applicationId, internshipTitle }: Props) {
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/offer-letter/${applicationId}`;
  const shareText = `I am thrilled to announce that I have been selected for a ${internshipTitle} Internship at AWH TECH! 🚀 \n\nCheck out my offer letter here: ${shareUrl}\n\n#internship #tech #career #awhtech #internhub`;

  const handleShare = () => {
    const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareText)}`;
    window.open(linkedinUrl, '_blank');
    toast.success('Opening LinkedIn...');
  };

  return (
    <button
      onClick={handleShare}
      className="btn-secondary text-xs py-1.5 px-3 bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 flex items-center gap-2 group w-full justify-center"
    >
      <LinkedinIcon className="group-hover:scale-110 transition-transform" />
      Share on LinkedIn
    </button>
  );
}
