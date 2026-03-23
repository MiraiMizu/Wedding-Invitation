import { notFound } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import styles from './page.module.css';

async function getInvitationData(slug) {
  const dataFilePath = path.join(process.cwd(), 'data.json');
  try {
    const fileData = await fs.readFile(dataFilePath, 'utf-8');
    const allData = JSON.parse(fileData);
    return allData[slug] || null;
  } catch (error) {
    return null;
  }
}

export default async function InvitationPage({ params }) {
  const { slug } = await params;
  const data = await getInvitationData(slug);

  if (!data) {
    notFound();
  }

  let formattedDate = data.date || "";
  if (data.date) {
    const d = new Date(data.date);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.floralTop}></div>
      <div className={styles.floralBottom}></div>
      
      <main className={styles.card}>
        <div className={styles.inviteText}>Düğünümüze Davetlisiniz</div>
        
        <h1 className={styles.names}>
          {data.brideName} <span className={styles.ampersand}>&</span> {data.groomName}
        </h1>

        <div className={styles.detailsDivider}></div>

        <div className={styles.details}>
          <div className={styles.detailItem}>
            <span className={styles.icon}>📅</span>
            <p className={styles.date}>{formattedDate}</p>
            <p className={styles.time}>{data.time}</p>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.icon}>📍</span>
            <p className={styles.location}>{data.location}</p>
          </div>
        </div>

        {data.message && (
          <div className={styles.messageBox}>
            <p>"{data.message}"</p>
          </div>
        )}

        <div className={styles.footer}>
          Bu mutlu günümüzde sizleri de aramızda görmekten onur duyacağız.
        </div>
      </main>
    </div>
  );
}
