'use client';

import React from 'react';
import PDFDownloadButton from './PDFDownloadButton';
import { OfferLetterTemplate } from './OfferLetterTemplate';
import { formatDate } from '@/lib/utils';
import { FileText } from 'lucide-react';

interface Props {
  internName: string;
  internshipTitle: string;
  startDate: string;
  endDate: string;
}

export default function OfferLetterDownload({ internName, internshipTitle, startDate, endDate }: Props) {
  const dateIssued = formatDate(new Date().toISOString());

  return (
    <PDFDownloadButton
      document={
        <OfferLetterTemplate
          internName={internName}
          internshipTitle={internshipTitle}
          startDate={formatDate(startDate)}
          endDate={formatDate(endDate)}
          dateIssued={dateIssued}
        />
      }
      fileName={`Offer_Letter_${internName.replace(/\s+/g, '_')}.pdf`}
      label="Download Offer Letter"
      className="btn-secondary text-xs py-1.5 px-3 bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100"
      icon={<FileText className="h-3.5 w-3.5" />}
    />
  );
}
