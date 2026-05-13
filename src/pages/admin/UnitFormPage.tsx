import { useState, useMemo, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUnit, useCreateUnit, useUpdateUnit } from '@/hooks/useUnits'
import { FormBanner } from '@/components/FormBanner'
import { SubmitButton } from '@/components/SubmitButton'
import { useSyncFormData } from '@/hooks/useSyncFormData'
import type { UnitType, EntityStatus } from '@/types/api'

const UNIT_TYPE_OPTIONS: { value: UnitType; label: string }[] = [
  { value: 'WEIGHT', label: 'Berat (kg, gr, dll)' },
  { value: 'VOLUME', label: 'Volume (liter, ml, dll)' },
  { value: 'QUANTITY', label: 'Jumlah (pcs, pack, dll)' },
]

const STATUS_OPTIONS: { value: EntityStatus; label: string }[] = [
  { value: 'pending', label: 'Tertunda' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'rejected', label: 'Ditolak' },
]

export default function UnitFormPage() {
  const { unitId } = useParams<{ unitId: string }>()
  const isEdit = Boolean(unitId) && unitId !== 'new'
  const navigate = useNavigate()

  const { data: existing, isLoading } = useUnit(isEdit ? unitId! : null)

  const createMutation = useCreateUnit()
  const updateMutation = useUpdateUnit()

  const [id, setId] = useState('')
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [type, setType] = useState<UnitType>('QUANTITY')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<EntityStatus>('approved')

  // Sync form when existing data loads
  useSyncFormData(existing, (data) => {
    setId(data.id)
    setName(data.name)
    setSymbol(data.symbol ?? '')
    setType(data.type)
    setDescription(data.description ?? '')
    setStatus(data.status)
  })

  const issues = useMemo(() => ({
    id: !id.trim() || !/^[A-Z][A-Z0-9_]*$/.test(id),
    name: !name.trim(),
    type: !type,
  }), [id, name, type])

  const issueCount = Object.values(issues).filter(Boolean).length

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (issueCount > 0) return

    if (isEdit && unitId) {
      updateMutation.mutate(
        {
          id: unitId,
          body: {
            name: name.trim(),
            symbol: symbol.trim() || null,
            type,
            description: description.trim() || null,
            status,
          },
        },
        { onSuccess: () => navigate('/admin/units') },
      )
    } else {
      createMutation.mutate(
        {
          id: id.trim(),
          name: name.trim(),
          symbol: symbol.trim() || undefined,
          type,
          description: description.trim() || undefined,
          status,
        },
        { onSuccess: () => navigate('/admin/units') },
      )
    }
  }

  const mutation = isEdit ? updateMutation : createMutation
  const saved = mutation.isSuccess

  if (isEdit && isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl animate-pulse" />
        <p className="text-gray-500 text-sm">{'Memuat satuan\u2026'}</p>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <button
        onClick={() => navigate('/admin/units')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </button>

      <h1 className="text-2xl font-extrabold text-gray-900">
        {isEdit ? 'Edit Satuan' : 'Tambah Satuan'}
      </h1>

      <FormBanner type="error" message={mutation.error?.message ?? 'Terjadi kesalahan'} visible={mutation.isError} />
      <FormBanner type="success" message="Satuan berhasil disimpan" visible={saved} />
      {issueCount > 0 && !saved && (
        <FormBanner type="warning" message={`${issueCount} masalah perlu diperbaiki`} visible />
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-5 space-y-4">
        {/* ID field */}
        <div>
          <label className={`block text-sm font-semibold mb-1.5 ${issues.id ? 'text-red-500' : 'text-gray-700'}`}>
            ID <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value.toUpperCase())}
            disabled={isEdit}
            placeholder="KG, L, PCS"
            className={`w-full h-10 rounded-xl border px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition ${
              issues.id ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-indigo-500'
            } ${isEdit ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
          />
          {issues.id && <p className="text-xs text-red-500 mt-1">ID harus huruf besar, diawali huruf, tanpa spasi</p>}
        </div>

        {/* Name field */}
        <div>
          <label className={`block text-sm font-semibold mb-1.5 ${issues.name ? 'text-red-500' : 'text-gray-700'}`}>
            Nama <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Kilogram"
            className={`w-full h-10 rounded-xl border px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition ${
              issues.name ? 'border-red-300 focus:ring-red-400' : 'border-gray-200 focus:ring-indigo-500'
            }`}
          />
        </div>

        {/* Symbol field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Simbol</label>
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="kg"
            className="w-full h-10 rounded-xl border border-gray-200 px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>

        {/* Type field */}
        <div>
          <label className={`block text-sm font-semibold mb-1.5 ${issues.type ? 'text-red-500' : 'text-gray-700'}`}>
            Tipe <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as UnitType)}
              className="h-10 w-full appearance-none rounded-xl border border-gray-200 px-4 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            >
              {UNIT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Description field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Opsional"
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
          />
        </div>

        {/* Status field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EntityStatus)}
              className="h-10 w-full appearance-none rounded-xl border border-gray-200 px-4 pr-8 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <SubmitButton loading={mutation.isPending} done={saved} />
      </form>
    </div>
  )
}