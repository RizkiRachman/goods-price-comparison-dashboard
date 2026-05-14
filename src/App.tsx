import { useLocation } from 'react-router-dom'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import GoodsListPage from '@/pages/GoodsListPage'
import GoodsDetailPage from '@/pages/GoodsDetailPage'
import StoreDetailPage from '@/pages/StoreDetailPage'
import ReceiptDetailPage from '@/pages/ReceiptDetailPage'
import ReceiptCorrectionPage from '@/pages/ReceiptCorrectionPage'
import ReceiptCreatePage from '@/pages/ReceiptCreatePage'
import PendingReceiptsPage from '@/pages/PendingReceiptsPage'
import GoodsTrackerPage from '@/pages/GoodsTrackerPage'
import { PageTransition } from '@/components/ui/PageTransition'
import { AdminLayout } from '@/components/AdminLayout'
import CategoryListPage from '@/pages/admin/CategoryListPage'
import CategoryFormPage from '@/pages/admin/CategoryFormPage'
import UnitListPage from '@/pages/admin/UnitListPage'
import UnitFormPage from '@/pages/admin/UnitFormPage'

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Navigate to="/goods" replace />} />
          <Route path="/goods" element={<GoodsListPage />} />
          <Route path="/goods/:id" element={<GoodsDetailPage />} />
          <Route path="/stores/:storeId" element={<StoreDetailPage />} />
          <Route path="/tracker" element={<GoodsTrackerPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="categories" replace />} />
            <Route path="categories" element={<CategoryListPage />} />
            <Route path="categories/new" element={<CategoryFormPage />} />
            <Route path="categories/:categoryId" element={<CategoryFormPage />} />
            <Route path="units" element={<UnitListPage />} />
            <Route path="units/new" element={<UnitFormPage />} />
            <Route path="units/:unitId" element={<UnitFormPage />} />
          </Route>
          <Route path="/receipts/pending" element={<PendingReceiptsPage />} />
          <Route path="/receipts/create" element={<ReceiptCreatePage />} />
          <Route path="/receipts/:receiptId/correct" element={<ReceiptCorrectionPage />} />
          <Route path="/receipts/:receiptId" element={<ReceiptDetailPage />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  )
}
