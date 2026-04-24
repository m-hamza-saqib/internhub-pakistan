'use client';

import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  document: any;
  fileName: string;
  label: string;
  className?: string;
  icon?: React.ReactNode;
}

export default function PDFDownloadButton({ document, fileName, label, className, icon }: Props) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <PDFDownloadLink
      document={document}
      fileName={fileName}
      className={cn(
        "btn-primary inline-flex items-center gap-2 transition-all",
        className
      )}
    >
      {({ loading }) => (
        <>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            icon || <Download className="h-4 w-4" />
          )}
          <span>{loading ? 'Preparing...' : label}</span>
        </>
      )}
    </PDFDownloadLink>
  );
}
