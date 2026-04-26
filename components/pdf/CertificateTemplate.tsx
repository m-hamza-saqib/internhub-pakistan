import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  border: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    borderWidth: 4,
    borderColor: '#0f172a', // Dark Navy/Black
  },
  innerBorder: {
    position: 'absolute',
    top: 30,
    left: 30,
    right: 30,
    bottom: 30,
    borderWidth: 1,
    borderColor: '#0f172a',
  },
  content: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  logo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 30,
    letterSpacing: -1,
  },
  header: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  subHeader: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 30,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  mainText: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 10,
  },
  internName: {
    fontSize: 42,
    fontWeight: 'heavy',
    color: '#0f172a',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  completionText: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 1.6,
    maxWidth: 500,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 60,
  },
  signatureBox: {
    alignItems: 'center',
    width: 170,
  },
  signatureLine: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#0f172a',
    marginTop: 5,
    paddingTop: 5,
  },
  qrCode: {
    width: 70,
    height: 70,
  },
  verifyText: {
    fontSize: 7,
    color: '#94a3b8',
    marginTop: 4,
  },
  certId: {
    position: 'absolute',
    bottom: 45,
    right: 50,
    fontSize: 8,
    color: '#94a3b8',
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
      <View style={styles.innerBorder} />
      
      <View style={styles.content}>
        <Text style={styles.logo}>AWH TECH</Text>
        
        <Text style={styles.header}>Certificate of Achievement</Text>
        <Text style={styles.subHeader}>BUILDING SOLUTIONS • DELIVERING EXCELLENCE</Text>
        
        <Text style={styles.mainText}>THIS IS TO CERTIFY THAT</Text>
        <Text style={styles.internName}>{internName}</Text>
        
        <Text style={styles.mainText}>has successfully completed the remote internship in</Text>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#0f172a', marginBottom: 20 }}>
          {internshipTitle}
        </Text>
        
        <Text style={styles.completionText}>
          In recognition of outstanding dedication, technical proficiency, and successful delivery 
          of industry-standard project requirements during the professional internship period.
          Authorized on {completionDate}.
        </Text>

        <View style={styles.footer}>
          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Director of Operations</Text>
            <View style={styles.signatureLine}>
              <Text style={{ fontSize: 8 }}>AWH TECH</Text>
            </View>
          </View>

          <View style={{ alignItems: 'center' }}>
            {qrCodeUrl && <Image src={qrCodeUrl} style={styles.qrCode} />}
            <Text style={styles.verifyText}>VERIFY CREDENTIAL</Text>
          </View>

          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Official Seal</Text>
            <View style={styles.signatureLine}>
              <Text style={{ fontSize: 8 }}>AWH TECH Pakistan</Text>
            </View>
          </View>
        </View>

        <Text style={styles.certId}>Credential ID: {certificateId}</Text>
      </View>
    </Page>
  </Document>
);
