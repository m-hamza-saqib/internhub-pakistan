import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 60,
    fontFamily: 'Helvetica',
    fontSize: 11,
    color: '#334155',
    lineHeight: 1.6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    borderBottomWidth: 2,
    borderBottomColor: '#0f172a',
    paddingBottom: 20,
  },
  brand: {
    color: '#0f172a',
    fontSize: 22,
    fontWeight: 'heavy',
    letterSpacing: -1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'black',
    color: '#0f172a',
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 2,
    fontSize: 10,
    textTransform: 'uppercase',
  },
  value: {
    color: '#0f172a',
    fontSize: 12,
    marginBottom: 10,
  },
  body: {
    marginTop: 20,
    marginBottom: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    left: 60,
    right: 60,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 20,
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 9,
  },
  signature: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    width: 200,
    paddingTop: 10,
  }
});

interface OfferLetterProps {
  internName: string;
  internshipTitle: string;
  startDate: string;
  endDate: string;
  dateIssued: string;
}

export const OfferLetterTemplate = ({ 
  internName, 
  internshipTitle, 
  startDate, 
  endDate,
  dateIssued 
}: OfferLetterProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.brand}>AWH TECH</Text>
        <Text style={{ color: '#94a3b8', fontSize: 8 }}>ID: AWH-OFFER-{Math.random().toString(36).substr(2, 6).toUpperCase()}</Text>
      </View>

      <View style={{ marginBottom: 30 }}>
        <Text style={{ color: '#64748b' }}>Date: {dateIssued}</Text>
      </View>

      <Text style={styles.title}>Internship Selection Offer</Text>

      <View style={styles.body}>
        <Text style={{ marginBottom: 15 }}>Dear {internName},</Text>
        
        <Text style={{ marginBottom: 15 }}>
          Congratulations! We are pleased to offer you a remote internship position as a <Text style={{ fontWeight: 'bold' }}>{internshipTitle}</Text> at AWH TECH. 
          Your skills and application stood out, and we are excited to have you join our innovative technical community.
        </Text>

        <View style={{ flexDirection: 'row', gap: 40, marginTop: 10, marginBottom: 20 }}>
          <View>
            <Text style={styles.label}>Start Date</Text>
            <Text style={styles.value}>{startDate}</Text>
          </View>
          <View>
            <Text style={styles.label}>End Date (Expected)</Text>
            <Text style={styles.value}>{endDate}</Text>
          </View>
        </View>

        <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>Terms of Engagement:</Text>
        <View style={{ marginLeft: 10, fontSize: 10 }}>
          <Text>• Role: Remote Technical Intern</Text>
          <Text>• Compensation: Educational Experience (Unpaid)</Text>
          <Text>• Working Hours: Flexible (Expected 15-20 hours/week)</Text>
          <Text>• Deliverables: Successful completion of required industry projects.</Text>
          <Text>• Certification: Official verified certificate issued upon completion.</Text>
        </View>

        <Text style={{ marginTop: 20 }}>
          At AWH TECH, we are dedicated to "Building solutions delivering excellence." We hope this internship provides 
          you with invaluable experience and the practical skills needed to excel in your professional career.
        </Text>
      </View>

      <View style={styles.signature}>
        <Text style={{ fontWeight: 'bold', color: '#0f172a' }}>Director of Programs</Text>
        <Text style={{ color: '#64748b' }}>AWH TECH</Text>
      </View>

      <Text style={styles.footer}>
        AWH TECH — Building solutions delivering excellence.
        Official Verification: awhtech.com/verify
      </Text>
    </Page>
  </Document>
);
