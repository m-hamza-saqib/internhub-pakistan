import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 0, // We'll use absolute positioning for the border
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  border: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    borderWidth: 2,
    borderColor: '#eab308', // Gold
  },
  content: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 40,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  subHeader: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 40,
  },
  mainText: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 10,
  },
  internName: {
    fontSize: 36,
    fontWeight: 'black',
    color: '#1e40af',
    marginBottom: 10,
    textDecoration: 'underline',
  },
  completionText: {
    fontSize: 14,
    color: '#334155',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 1.5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 40,
  },
  signatureBox: {
    alignItems: 'center',
    width: 150,
  },
  signatureLine: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#0f172a',
    marginTop: 5,
    paddingTop: 5,
  },
  qrCode: {
    width: 80,
    height: 80,
    marginTop: 20,
  },
  verifyText: {
    fontSize: 8,
    color: '#94a3b8',
    marginTop: 5,
  },
  certId: {
    position: 'absolute',
    bottom: 40,
    right: 40,
    fontSize: 10,
    color: '#94a3b8',
    fontFamily: 'Courier',
  }
});

interface CertificateProps {
  internName: string;
  internshipTitle: string;
  completionDate: string;
  certificateId: string;
  qrCodeUrl?: string;
}

export const CertificateTemplate = ({ 
  internName, 
  internshipTitle, 
  completionDate, 
  certificateId,
  qrCodeUrl 
}: CertificateProps) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.border} />
      
      <View style={styles.content}>
        <Text style={styles.logo}>InternHub Pakistan</Text>
        
        <Text style={styles.header}>Certificate of Completion</Text>
        <Text style={styles.subHeader}>PROUDLY PRESENTED TO</Text>
        
        <Text style={styles.internName}>{internName}</Text>
        
        <Text style={styles.mainText}>For successfully completing the</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 20 }}>
          {internshipTitle} Internship Program
        </Text>
        
        <Text style={styles.completionText}>
          This certificate recognizes the intern's commitment to professional growth and 
          mastery of industry-standard workflows during this intensive remote program.
          Completed on {completionDate}.
        </Text>

        <View style={styles.footer}>
          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Suleman Mehmood</Text>
            <View style={styles.signatureLine}>
              <Text style={{ fontSize: 8 }}>Program Director</Text>
            </View>
          </View>

          <View style={{ alignItems: 'center' }}>
            {qrCodeUrl && <Image src={qrCodeUrl} style={styles.qrCode} />}
            <Text style={styles.verifyText}>Scan to Verify</Text>
          </View>

          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 10, fontWeight: 'bold' }}>InternHub Pakistan</Text>
            <View style={styles.signatureLine}>
              <Text style={{ fontSize: 8 }}>Official Seal</Text>
            </View>
          </View>
        </View>

        <Text style={styles.certId}>Verification ID: {certificateId}</Text>
      </View>
    </Page>
  </Document>
);
