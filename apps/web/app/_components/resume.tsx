"use client";

import type { Job } from "@/lib/payload-types";
import {
  Document,
  Font,
  Page,
  PDFDownloadLink,
  PDFViewer,
  StyleSheet,
  Text,
  View,
  Svg,
  Path,
} from "@react-pdf/renderer";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  jobs: Job[];
};

Font.register({
  family: "Lato",
  fonts: [
    {
      src: "/fonts/Lato-Regular.ttf",
      fontWeight: 400,
      fontStyle: "normal",
    },
    {
      src: "/fonts/Lato-Bold.ttf",
      fontWeight: 700,
      fontStyle: "normal",
    },
    {
      src: "/fonts/Lato-Black.ttf",
      fontWeight: 900,
      fontStyle: "normal",
    },
    {
      src: "/fonts/Lato-Light.ttf",
      fontWeight: 300,
      fontStyle: "normal",
    },
    {
      src: "/fonts/Lato-Thin.ttf",
      fontWeight: 100,
      fontStyle: "normal",
    },
    {
      src: "/fonts/Lato-Italic.ttf",
      fontWeight: 400,
      fontStyle: "italic",
    },
    {
      src: "/fonts/Lato-BoldItalic.ttf",
      fontWeight: 700,
      fontStyle: "italic",
    },
    {
      src: "/fonts/Lato-BlackItalic.ttf",
      fontWeight: 900,
      fontStyle: "italic",
    },
    {
      src: "/fonts/Lato-LightItalic.ttf",
      fontWeight: 300,
      fontStyle: "italic",
    },
    {
      src: "/fonts/Lato-ThinItalic.ttf",
      fontWeight: 100,
      fontStyle: "italic",
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: "30px 40px",
    fontFamily: "Lato",
    fontSize: 9,
    color: "#2D3748",
    lineHeight: 1.4,
    fontWeight: 400,
  },
  header: {
    textAlign: "center",
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: 900,
    fontFamily: "Lato",
    letterSpacing: 1,
  },
  location: {
    textAlign: "center",
    fontSize: 9,
    color: "#4A5568",
    marginBottom: 6,
    lineHeight: 1.5,
    fontFamily: "Lato",
    fontWeight: 400,
  },
  section: {
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Lato",
    fontWeight: 900,
    marginBottom: 6,
    borderBottom: "1px solid black",
    paddingBottom: 6,
    color: "#1A202C",
    letterSpacing: 0.7,
  },
  company: {
    fontFamily: "Lato",
    fontWeight: 700,
  },
  jobTitle: {
    fontFamily: "Lato",
    fontWeight: 400,
    fontStyle: "italic",
  },
  jobDuration: {
    fontFamily: "Lato",
    fontWeight: 400,
    fontStyle: "italic",
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: 700,
    fontSize: 9,
  },
  jobHeader2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: 9,
  },
  bulletPoint: {
    fontSize: 9,
    fontFamily: "Lato",
  },
  techStack: {
    flexDirection: "row",
    justifyContent: "flex-start",
    fontSize: 9,
    fontFamily: "Lato",
    fontWeight: 400,
    marginTop: 4,
  },
  summary: {
    fontSize: 9,
    marginBottom: 6,
    lineHeight: 1.6,
    color: "#2D3748",
    fontFamily: "Lato",
    fontWeight: 400,
  },
  skillRow: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "center",
  },
  skillIcon: {
    width: 24,
    fontSize: 9,
  },
  skillText: {
    flex: 1,
    fontSize: 9,
  },
  education: {
    marginBottom: 3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  educationDate: {
    fontSize: 9,
    fontStyle: "italic",
  },
  educationHeader: {
    flexDirection: "column",
    fontSize: 9,
  },
});

// PDF Document component
const ResumePDF = ({ jobs }: Props) => {
  const CodeIcon = () => (
    <Svg width="12" height="12" viewBox="0 0 24 24">
      <Path
        d="M16 18L22 12L16 6"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M8 6L2 12L8 18"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );

  const ToolsIcon = () => (
    <Svg width="12" height="12" viewBox="0 0 24 24">
      <Path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );

  const FrameworkIcon = () => (
    <Svg width="12" height="12" viewBox="0 0 24 24">
      <Path
        d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M12 4v16M4 9h16M4 15h16"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const DatabaseIcon = () => (
    <Svg width="12" height="12" viewBox="0 0 24 24">
      <Path
        d="M12 2C7.58172 2 4 3.79086 4 6V18C4 20.2091 7.58172 22 12 22C16.4183 22 20 20.2091 20 18V6C20 3.79086 16.4183 2 12 2Z"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M4 6C4 8.20914 7.58172 10 12 10C16.4183 10 20 8.20914 20 6"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 7.5V16.5"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const CloudIcon = () => (
    <Svg width="12" height="12" viewBox="0 0 24 24">
      <Path
        d="M17.5 19H9C6.24 19 4 16.76 4 14C4 11.24 6.24 9 9 9C9.21 9 9.41 9.01 9.61 9.04C10.79 6.59 13.19 5 16 5C19.87 5 23 8.13 23 12C23 15.87 20.37 19 17.5 19Z"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>ISAAC YANG</Text>
        </View>
        <Text style={styles.location}>
          Singaporean | (+65) 96733834 | YANGJING.YJ56@gmail.com |
          https://www.linkedin.com/in/yang-jing-992b75143
        </Text>

        {/* Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EXPERIENCE</Text>
          {jobs.map((job) => (
            <View key={job.id} style={{ marginBottom: 12 }}>
              <View style={styles.jobHeader}>
                <Text style={styles.company}>{job.company}</Text>
                <Text style={styles.jobDuration}>Singapore ({job.duration})</Text>
              </View>
              <View style={styles.jobHeader2}>
                <Text style={styles.jobTitle}>{job.title}</Text>
              </View>
              {job.scopes?.map((scope) => (
                <Text key={scope.id} style={styles.bulletPoint}>
                  <Text style={{ fontWeight: 700, textTransform: "capitalize" }}>
                    {scope.description.split(" ")[0]}
                  </Text>
                  {" " + scope.description.split(" ").slice(1).join(" ")}
                </Text>
              ))}
              <View style={styles.techStack}>
                <Text style={{ textDecoration: "underline" }}>Tech stacks: </Text>
                <Text>{job.techstacks?.map((tech) => tech.techstack).join(", ")}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EDUCATION</Text>
          <View style={styles.education}>
            <View style={styles.educationHeader}>
              <Text style={{ fontWeight: 700 }}>National University of Singapore</Text>
              <Text>Information Systems with Honors distinction</Text>
            </View>

            <Text style={styles.educationDate}>August 2014 - April 2017</Text>
          </View>
          <View style={styles.education}>
            <View style={styles.educationHeader}>
              <Text style={{ fontWeight: 700 }}>Singapore Polytechnic</Text>
              <Text>Business Information Technology with Merit</Text>
            </View>
            <Text style={styles.educationDate}>April 2009 - April 2012</Text>
          </View>
        </View>

        {/* Certifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CERTIFICATIONS & TRAININGS</Text>
          <View style={styles.education}>
            <Text>AWS Certified Solutions Architect - Associate</Text>
          </View>
          <View style={styles.education}>
            <Text>Professional Scrum Master I (PSM I)</Text>
          </View>
          <View style={styles.education}>
            <Text>Certified Kubernetes Application Developer (CKAD)</Text>
          </View>
          <View style={styles.education}>
            <Text>LLM Engineering</Text>
          </View>
        </View>

        {/* Skillset */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SKILLSET</Text>
          <View style={styles.skillRow}>
            <View style={styles.skillIcon}>
              <CodeIcon />
            </View>
            <Text style={styles.skillText}>JavaScript, TypeScript, Java, SQL, Dart, Python</Text>
          </View>
          <View style={styles.skillRow}>
            <View style={styles.skillIcon}>
              <ToolsIcon />
            </View>
            <Text style={styles.skillText}>
              NextJS, React, React Native, Vue.js, NestJS, Flutter
            </Text>
          </View>
          <View style={styles.skillRow}>
            <View style={styles.skillIcon}>
              <FrameworkIcon />
            </View>
            <Text style={styles.skillText}>Git, Jira, Visual Code Studio, IntelliJ, Docker</Text>
          </View>
          <View style={styles.skillRow}>
            <View style={styles.skillIcon}>
              <DatabaseIcon />
            </View>
            <Text style={styles.skillText}>
              PostgreSQL, MySQL, Redis, MongoDB, Elasticsearch, Kafka, RabbitMQ
            </Text>
          </View>
          <View style={styles.skillRow}>
            <View style={styles.skillIcon}>
              <CloudIcon />
            </View>
            <Text style={styles.skillText}>
              AWS, GCP, Azure, Docker, Kubernetes, Terraform, Helm, CI/CD, i18n
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Main Resume component
export const Resume = ({ jobs }: Props) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-gray-100 py-8">
      {loaded && (
        <>
          <PDFViewer className="h-[100vh] w-[1100px] bg-white shadow-lg">
            <ResumePDF jobs={jobs} />
          </PDFViewer>

          <PDFDownloadLink
            document={<ResumePDF jobs={jobs} />}
            fileName="resume.pdf"
            className="fixed bottom-8 right-8 flex items-center gap-2 rounded-full bg-blue-600 p-3 text-white shadow-lg transition-colors hover:bg-blue-700"
          >
            <Download className="h-5 w-5" />
            <span>{"Download PDF"}</span>
          </PDFDownloadLink>
        </>
      )}
    </div>
  );
};
