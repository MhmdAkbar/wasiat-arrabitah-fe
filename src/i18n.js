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
      },
      "template": {
        "title": "Template Management",
        "desc": "Manage dynamic form structures for document requests.",
        "add_btn": "Create Template",
        "code": "Template Code",
        "name": "Template Name",
        "schema": "Schema Definition (JSON)",
        "status": "Status",
        "date": "Created Date",
        "active": "Active",
        "cancel": "Cancel",
        "save": "Save Template",
        "empty": "No templates available.",
        "err_json": "Invalid JSON format for Schema Definition.",
        "builder_title": "Form Fields Configuration",
        "add_field": "Add New Field",
        "field_label": "Field Label (e.g., Full Name)",
        "field_key": "Unique Key",
        "field_type": "Data Type",
        "field_req": "Required",
        "remove": "Remove",
        "workflow_btn": "Set Workflow",
        "workflow_title": "Approval Workflow",
        "workflow_desc": "Set the hierarchy of approvers for this form template.",
        "step": "Step",
        "add_step": "Add Approval Step",
        "no_workflow": "No workflow has been set up yet.",
        "save_workflow": "Save Workflow",
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
      },
      "template": {
        "title": "Manajemen Template",
        "desc": "Kelola struktur form dinamis untuk pengajuan dokumen.",
        "add_btn": "Buat Template",
        "code": "Kode Template",
        "name": "Nama Template",
        "schema": "Definisi Skema (JSON)",
        "status": "Status",
        "date": "Tanggal Dibuat",
        "active": "Aktif",
        "cancel": "Batal",
        "save": "Simpan Template",
        "empty": "Belum ada template tersedia.",
        "err_json": "Format JSON untuk Definisi Skema tidak valid.",
        "builder_title": "Konfigurasi Kolom Form",
        "add_field": "Tambah Kolom",
        "field_label": "Label (misal: Nama Lengkap)",
        "field_key": "Kunci Unik (Key)",
        "field_type": "Tipe Data",
        "field_req": "Wajib Diisi",
        "remove": "Hapus",
        "workflow_btn": "Atur Workflow",
        "workflow_title": "Alur Persetujuan (Workflow)",
        "workflow_desc": "Atur hierarki pihak yang harus menyetujui form ini.",
        "step": "Langkah",
        "add_step": "Tambah Langkah Persetujuan",
        "no_workflow": "Belum ada alur persetujuan yang diatur.",
        "save_workflow": "Simpan Alur",
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