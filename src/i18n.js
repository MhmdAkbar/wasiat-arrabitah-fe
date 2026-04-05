import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "app_name": "BPM Digital",
      "mosque_name": "Ar-Rabitah Mosque",
      "auth": {
        "email": "Email Address",
        "password": "Password",
        "name": "Full Name",
        "department": "Department / Division",
        "role": "System Role",
        "login_title": "Login to your account",
        "register_title": "Create new account",
        "login_btn": "Sign In",
        "register_btn": "Register",
        "loading": "Processing...",
        "no_account": "Don't have an account?",
        "have_account": "Already have an account?",
        "login_err": "Invalid credentials. Please try again.",
        "register_err": "Failed to register. Please check your data."
      },
      "dashboard": {
        "menu": "Main Menu",
        "home": "Dashboard",
        "template": "Template Management",
        "document": "Document Request",
        "logout": "Sign Out",
        "welcome_title": "Panel Overview",
        "welcome_desc": "Welcome back to the document management system.",
        "test_api_title": "API Test Area",
        "test_api_desc": "Verify your JWT token to the backend endpoint.",
        "test_api_btn": "Run Connection Test"
      }
    }
  },
  id: {
    translation: {
      "app_name": "BPM Digital",
      "mosque_name": "Masjid Ar-Rabitah",
      "auth": {
        "email": "Alamat Email",
        "password": "Kata Sandi",
        "name": "Nama Lengkap",
        "department": "Departemen / Divisi",
        "role": "Peran Sistem",
        "login_title": "Masuk ke akun Anda",
        "register_title": "Buat akun baru",
        "login_btn": "Masuk ke Sistem",
        "register_btn": "Daftar Sekarang",
        "loading": "Memproses...",
        "no_account": "Belum memiliki akses?",
        "have_account": "Sudah punya akun?",
        "login_err": "Login gagal. Periksa kembali kredensial Anda.",
        "register_err": "Registrasi gagal. Periksa kembali data Anda."
      },
      "dashboard": {
        "menu": "Menu Utama",
        "home": "Dasbor",
        "template": "Manajemen Template",
        "document": "Pengajuan Dokumen",
        "logout": "Keluar",
        "welcome_title": "Ikhtisar Panel",
        "welcome_desc": "Selamat datang kembali di sistem pengelolaan dokumen.",
        "test_api_title": "Area Pengujian API",
        "test_api_desc": "Verifikasi token JWT Anda ke endpoint backend.",
        "test_api_btn": "Jalankan Tes Koneksi"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Default bahasa Inggris untuk Singapura
    fallbackLng: "en",
    interpolation: { escapeValue: false }
  });

export default i18n;