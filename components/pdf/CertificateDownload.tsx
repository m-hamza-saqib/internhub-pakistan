'use client';

import React from 'react';
import PDFDownloadButton from './PDFDownloadButton';
import { CertificateTemplate } from './CertificateTemplate';
import { formatDate } from '@/lib/utils';
import { Award } from 'lucide-react';

interface Props {
  internName: string;
  internshipTitle: string;
  completionDate: string;
  certificateId: string;
}

export default function CertificateDownload({ internName, internshipTitle, completionDate, certificateId }: Props) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`${appUrl}/verify/${certificateId}`)}`;

  return (
    <PDFDownloadButton
      document={
        <CertificateTemplate
          internName={internName}
          internshipTitle={internshipTitle}
          completionDate={formatDate(completionDate)}
          certificateId={certificateId}
          qrCodeUrl={qrCodeUrl}
        />
      }
      fileName={`Certificate_${internName.replace(/\s+/g, '_')}_${certificateId}.pdf`}
      label="Download Certificate"
      className="btn-primary flex-1 py-3"
      icon={<Award className="h-4 w-4" />}
    />
  );
}
