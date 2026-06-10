import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { receiptsApi } from '@/api/receipts'
import { compressImageIfNeeded } from '@/lib/utils'
import { ModalShell } from '@/components/ui/ModalShell'

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

    const isImage = f.type.startsWith('image/')

    try {
      if (isImage) {
        const result = await compressImageIfNeeded(f)
        setFile(result.file)
        if (result.compressed) {
          setCompressedInfo({ from: result.originalSize, to: result.file.size })
        }
      } else {
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
    <ModalShell open={true} onClose={onClose} variant="sheet">
      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-4 pb-2 sm:pt-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-retro-text">Upload Struk Belanja</h2>
          <p className="text-sm text-retro-muted mt-0.5">Pantau harga belanjaanmu dengan mudah</p>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-none text-retro-muted hover:bg-retro-surface/80 transition flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="px-6 pb-6 sm:pb-8 flex flex-col gap-4">
        {/* Drop zone */}
        <motion.div
          animate={dragging ? { scale: 1.01, borderColor: 'rgb(99,102,241)' } : { scale: 1, borderColor: file ? 'rgb(52,211,153)' : 'rgb(229,231,235)' }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-none p-8 sm:p-10 text-center cursor-pointer transition-colors ${
dragging
? 'bg-retro-surface-alt'
: file
? 'bg-retro-surface-alt border border-retro-success/30'
: 'hover:bg-retro-surface-alt/80'
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
              <div className="w-14 h-14 bg-retro-surface-alt rounded-none flex items-center justify-center text-3xl">📄</div>
              <p className="font-semibold text-retro-text text-sm">{file.name}</p>
              <p className="text-xs text-retro-muted">
                {formatSize(file.size)}
                {compressedInfo && (
                  <span className="text-retro-success ml-1">
                    (dikompres dari {formatSize(compressedInfo.from)})
                  </span>
                )}
                {' · '}Siap diupload
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 bg-retro-surface-alt rounded-none flex items-center justify-center text-3xl">🧾</div>
              <div>
                <p className="font-semibold text-retro-body">
                  Drag & drop atau <span className="text-retro-brand">pilih file</span>
                </p>
                <p className="text-xs text-retro-muted mt-1">Foto struk supermarket · JPG, PNG, PDF · Maks 6 MB</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 text-sm text-retro-danger bg-retro-surface border-l-4 border-l-retro-danger/60 border border-retro-border/50 rounded-none px-3 py-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Info */}
        <div className="flex items-center gap-2 text-xs text-retro-muted">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Gambar di atas 3,5 MB akan otomatis dikompres. Maksimum 6 MB.
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading || !!error}
          className="w-full py-4 rounded-none font-bold text-retro-text bg-gradient-to-r from-amber-600 to-retro-gold hover:from-amber-700 hover:to-retro-gold/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 text-base"
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
    </ModalShell>
  )
}
