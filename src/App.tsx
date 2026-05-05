import { Routes, Route, Navigate } from 'react-router-dom'
import GoodsListPage from '@/pages/GoodsListPage'
import GoodsDetailPage from '@/pages/GoodsDetailPage'
import StoreDetailPage from '@/pages/StoreDetailPage'
import ReceiptDetailPage from '@/pages/ReceiptDetailPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/goods" replace />} />
      <Route path="/goods" element={<GoodsListPage />} />
      <Route path="/goods/:id" element={<GoodsDetailPage />} />
      <Route path="/stores/:storeId" element={<StoreDetailPage />} />
      <Route path="/receipts/:receiptId" element={<ReceiptDetailPage />} />
    </Routes>
  )
}
