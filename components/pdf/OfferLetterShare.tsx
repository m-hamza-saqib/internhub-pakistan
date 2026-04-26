'use client';

import { Linkedin, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  applicationId: string;
  internshipTitle: string;
}

export default function OfferLetterShare({ applicationId, internshipTitle }: Props) {
  const shareUrl = `${window.location.origin}/offer-letter/${applicationId}`;
  const shareText = `I am thrilled to announce that I have been selected for a ${internshipTitle} Internship at AWH TECH! 🚀 \n\nCheck out my offer letter here: ${shareUrl}\n\n#internship #tech #career #awhtech #internhub`;

  const handleShare = () => {
    const linkedinUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareText)}`;
    window.open(linkedinUrl, '_blank');
    toast.success('Opening LinkedIn...');
  };

  return (
    <button
      onClick={handleShare}
      className="btn-secondary text-xs py-1.5 px-3 bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 flex items-center gap-2 group"
    >
      <Linkedin className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
      Share on LinkedIn
    </button>
  );
}
