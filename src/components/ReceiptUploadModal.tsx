import { useRef, useState } from 'react'
import { receiptsApi } from '@/api/receipts'
import { compressImageIfNeeded } from '@/lib/utils'

interface Props {
  onClose: () => void
  onJobCreated: (receipId: string, fileName: string) => void
}

export function ReceiptUploadModal({ onClose, onJobCreated }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [compressedInfo, setCompressedInfo] = useState<{ from: number; to: number } | null>(null)

  function formatSize(bytes: number): string {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  async function handleFile(f: File) {
    setError(null)
    setCompressedInfo(null)

    // Only compress image files, not PDF
    const isImage = f.type.startsWith('image/')

    try {
      if (isImage) {
        const result = await compressImageIfNeeded(f)
        setFile(result.file)
        if (result.compressed) {
          setCompressedInfo({ from: result.originalSize, to: result.file.size })
        }
      } else {
        // PDF: just check hard limit
        const MAX_UPLOAD_SIZE = 6 * 1024 * 1024
        if (f.size > MAX_UPLOAD_SIZE) {
          setError('Ukuran file melebihi batas maksimum 6 MB.')
          return
        }
        setFile(f)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memproses file.')
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  async function handleUpload() {
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const { receiptId } = await receiptsApi.upload(file)
      onJobCreated(receiptId, file.name)
      onClose()
    } catch {
      setError('Gagal mengupload struk. Coba lagi.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-4 pb-2 sm:pt-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Upload Struk Belanja</h2>
            <p className="text-sm text-gray-400 mt-0.5">Pantau harga belanjaanmu dengan mudah</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:bg-gray-100 transition flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 pb-6 sm:pb-8 flex flex-col gap-4">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
              dragging
                ? 'border-indigo-500 bg-indigo-50 scale-[1.01]'
                : file
                ? 'border-emerald-400 bg-emerald-50'
                : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            {file ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl">📄</div>
                <p className="font-semibold text-gray-800 text-sm">{file.name}</p>
                <p className="text-xs text-gray-400">
                  {formatSize(file.size)}
                  {compressedInfo && (
                    <span className="text-emerald-600 ml-1">
                      (dikompres dari {formatSize(compressedInfo.from)})
                    </span>
                  )}
                  {' · '}Siap diupload
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-3xl">🧾</div>
                <div>
                  <p className="font-semibold text-gray-700">
                    Drag & drop atau <span className="text-indigo-600">pilih file</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Foto struk supermarket · JPG, PNG, PDF · Maks 6 MB</p>
                </div>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 text-sm text-rose-600 bg-rose-50 rounded-xl px-3 py-2">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Info */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Gambar di atas 3,5 MB akan otomatis dikompres. Maksimum 6 MB.
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || uploading || !!error}
            className="w-full py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-indigo-200 active:scale-[0.98] flex items-center justify-center gap-2 text-base"
          >
            {uploading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Mengirim struk…
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload & Analisis
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
