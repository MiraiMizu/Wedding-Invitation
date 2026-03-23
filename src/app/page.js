"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: '',
    date: '',
    time: '',
    location: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateSlug = (bride, groom) => {
    const normalize = (str) => 
      str.trim().toLowerCase()
         .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
         .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
         .replace(/[^a-z0-9]/g, '-');
    
    return `${normalize(bride)}-ve-${normalize(groom)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const slug = generateSlug(formData.brideName, formData.groomName);
    
    try {
      // API call to save data
      const response = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, slug }),
      });

      if (response.ok) {
        router.push(`/${slug}`);
      } else {
        alert("Bir hata oluştu. Lütfen tekrar deneyin.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("Bağlantı hatası.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={`${styles.header} animate-fade-in`}>
        <div className={styles.logo}>SonsuzDavet</div>
      </header>

      <main className={styles.main}>
        <div className={`${styles.hero} animate-fade-in delay-1`}>
          <h1>En Güzel Gününüzü <br/><span>Zarifçe</span> Duyurun.</h1>
          <p>Kendi dijital düğün davetiyenizi saniyeler içinde oluşturun ve sevdiklerinizle tek bir link üzerinden paylaşın.</p>
        </div>

        <div className={`${styles.formContainer} animate-fade-in delay-2`}>
          <div className={styles.formHeader}>
            <h2>Davetiyenizi Oluşturun</h2>
            <p>Lütfen davetiyenizde yer alacak bilgileri girin.</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className="input-group">
                <label>Gelin Adı</label>
                <input required type="text" name="brideName" placeholder="Örn: Ayşe" value={formData.brideName} onChange={handleChange} />
              </div>
              <div className={styles.divider}>&</div>
              <div className="input-group">
                <label>Damat Adı</label>
                <input required type="text" name="groomName" placeholder="Örn: Ali" value={formData.groomName} onChange={handleChange} />
              </div>
            </div>

            <div className={styles.row}>
              <div className="input-group">
                <label>Tarih</label>
                <input required type="date" name="date" value={formData.date} onChange={handleChange} />
              </div>
              <div className="input-group">
                <label>Saat</label>
                <input required type="time" name="time" value={formData.time} onChange={handleChange} />
              </div>
            </div>

            <div className="input-group">
              <label>Mekan / Adres</label>
              <textarea required name="location" placeholder="Düğün mekanının adı ve açık adresi..." value={formData.location} onChange={handleChange} />
            </div>

            <div className="input-group">
              <label>Özel Mesajınız</label>
              <textarea name="message" placeholder="Misafirlerinize iletmek istediğiniz özel bir not (İsteğe bağlı)" value={formData.message} onChange={handleChange} />
            </div>

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Oluşturuluyor...' : 'Davetiyemi Oluştur ✨'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
