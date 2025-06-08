import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Admin
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import MenuPage from "./pages/admin/MenuPage";
import StaffPage from "./pages/admin/StaffPage";
import LaporanPage from "./pages/admin/LaporanPage";
import TambahMenuPage from "./pages/admin/TambahMenuPage";
import TambahStaffPage from "./pages/admin/TambahStaffPage";
import EditStaffPage from "./pages/admin/EditStaffPage";
import EditMenuPage from "./pages/admin/EditMenuPage";
import PendapatanDetailPage from "./pages/admin/PendapatanDetailPage";
import TransaksiDetailPage from "./pages/admin/TransaksiDetailPage";
import MenuTerjualDetailPage from "./pages/admin/MenuTerjualDetailPage";
import DetailPesananAdminPage from "./pages/admin/DetailPesananAdmin";

// Kasir
import DashboardKasir from "./pages/kasir/DashboardKasir";
import PesananPage from "./pages/kasir/PesananPage";
import TambahPesananPage from "./pages/kasir/TambahPesananPage";
import KasirDetailPesananPage from "./pages/kasir/DetailPesananPage";

// Etalase
import DashboardEtalase from "./pages/etalase/DashboardEtalase";
import PesananMasukPage from "./pages/etalase/PesananMasukPage";
import RiwayatPesananPage from "./pages/etalase/RiwayatPesananPage";
import DetailPesananEtalasePage from "./pages/etalase/DetailPesananEtalasePage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        {/* Kepala Toko/Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pendapatan"
          element={
            <ProtectedRoute allowedRole="admin">
              <PendapatanDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/transaksi"
          element={
            <ProtectedRoute allowedRole="admin">
              <TransaksiDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/menu-terlaris"
          element={
            <ProtectedRoute allowedRole="admin">
              <MenuTerjualDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute allowedRole="admin">
              <MenuPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/menu/tambah"
          element={
            <ProtectedRoute allowedRole="admin">
              <TambahMenuPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/menu/edit/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <EditMenuPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/staff"
          element={
            <ProtectedRoute allowedRole="admin">
              <StaffPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/tambah"
          element={
            <ProtectedRoute allowedRole="admin">
              <TambahStaffPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/edit/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <EditStaffPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/laporan"
          element={
            <ProtectedRoute allowedRole="admin">
              <LaporanPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pesanan/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <DetailPesananAdminPage />
            </ProtectedRoute>
          }
        />

        {/* Kasir */}
        <Route
          path="/kasir"
          element={
            <ProtectedRoute allowedRole="kasir">
              <DashboardKasir />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kasir/pesanan"
          element={
            <ProtectedRoute allowedRole="kasir">
              <PesananPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kasir/tambah-pesanan"
          element={
            <ProtectedRoute allowedRole="kasir">
              <TambahPesananPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kasir/detail-pesanan/:id"
          element={
            <ProtectedRoute allowedRole="kasir">
              <KasirDetailPesananPage />
            </ProtectedRoute>
          }
        />
        {/* Etalase */}
        <Route
          path="/etalase"
          element={
            <ProtectedRoute allowedRole="etalase">
              <DashboardEtalase />
            </ProtectedRoute>
          }
        />
        <Route
          path="/etalase/pesanan-masuk"
          element={
            <ProtectedRoute allowedRole="etalase">
              <PesananMasukPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/etalase/riwayat"
          element={
            <ProtectedRoute allowedRole="etalase">
              <RiwayatPesananPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/etalase/pesanan/:id"
          element={
            <ProtectedRoute allowedRole="etalase">
              <DetailPesananEtalasePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
