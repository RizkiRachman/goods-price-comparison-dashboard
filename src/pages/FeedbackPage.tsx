import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFeedbackSubmit } from '@/hooks/useFeedbackSubmit'
import type { FeedbackType, CreateFeedbackQuestionRequest } from '@/types/api'

export default function FeedbackPage() {
  const navigate = useNavigate()
  const mutation = useFeedbackSubmit()

  const [form, setForm] = useState<CreateFeedbackQuestionRequest>({
    userName: '',
    userEmail: '',
    type: 'feedback',
    message: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof CreateFeedbackQuestionRequest, string>>>({})

  const isSuccess = mutation.isSuccess

  function validate(): boolean {
    const e: Partial<Record<keyof CreateFeedbackQuestionRequest, string>> = {}
    if (!form.userName.trim()) e.userName = 'Nama wajib diisi'
    if (!form.userEmail.trim()) e.userEmail = 'Email wajib diisi'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.userEmail)) e.userEmail = 'Format email tidak valid'
    if (!form.message.trim()) e.message = 'Pesan wajib diisi'
    else if (form.message.length > 5000) e.message = 'Maksimal 5000 karakter'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    mutation.mutate(form)
  }

  function handleReset() {
    setForm({ userName: '', userEmail: '', type: 'feedback', message: '' })
    setErrors({})
    mutation.reset()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Sticky Navbar ── */}
      <header className="sticky top-0 z-30 h-14 flex items-center bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center justify-center transition-colors"
            aria-label="Kembali"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-black text-slate-900 text-lg tracking-tight">Feedback & Pertanyaan</span>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-16 -left-16 w-56 h-56 bg-purple-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14">
          <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur text-white/90 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Bantu kami jadi lebih baik
          </div>

          <h1 className="text-3xl font-black tracking-tight text-white leading-tight mb-2">
            Kirim <span className="text-amber-200">Feedback</span> atau <span className="text-amber-200">Pertanyaan</span>
          </h1>
          <p className="text-white/60 text-sm max-w-md">
            Punya saran, pertanyaan, atau menemukan bug? Sampaikan di sini. Masukan Anda sangat berharga untuk pengembangan HargaKu.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pb-24">
        {isSuccess ? (
          /* ── Success State ── */
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Terima kasih!</h2>
            <p className="text-slate-500 text-sm mb-6">
              {form.type === 'feedback'
                ? 'Feedback Anda sudah kami terima. Masukan Anda sangat membantu pengembangan HargaKu.'
                : 'Pertanyaan Anda sudah kami terima. Kami akan segera merespons.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-semibold rounded-xl transition-colors"
              >
                Kirim Lagi
              </button>
              <button
                onClick={() => navigate('/goods')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            {/* Type toggle */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tipe</label>
              <div className="flex gap-2">
                {(['feedback', 'question'] as FeedbackType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: t }))}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                      form.type === t
                        ? t === 'feedback'
                          ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                          : 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                        : 'bg-slate-50 text-slate-500 border-2 border-transparent hover:bg-slate-100'
                    }`}
                  >
                    <span>{t === 'feedback' ? '\uD83D\uDCDD' : '\u2753'}</span>
                    {t === 'feedback' ? 'Feedback' : 'Pertanyaan'}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="userName" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Nama <span className="text-rose-500">*</span>
              </label>
              <input
                id="userName"
                type="text"
                value={form.userName}
                onChange={(e) => setForm((f) => ({ ...f, userName: e.target.value }))}
                placeholder="Nama Anda"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition ${
                  errors.userName ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-400'
                } outline-none focus:ring-2 focus:ring-indigo-100`}
              />
              {errors.userName && <p className="text-xs text-rose-500 mt-1">{errors.userName}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="userEmail" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email <span className="text-rose-500">*</span>
              </label>
              <input
                id="userEmail"
                type="email"
                value={form.userEmail}
                onChange={(e) => setForm((f) => ({ ...f, userEmail: e.target.value }))}
                placeholder="email@contoh.com"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition ${
                  errors.userEmail ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-400'
                } outline-none focus:ring-2 focus:ring-indigo-100`}
              />
              {errors.userEmail && <p className="text-xs text-rose-500 mt-1">{errors.userEmail}</p>}
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Pesan <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="message"
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                placeholder={form.type === 'feedback' ? 'Ceritakan pengalaman Anda menggunakan HargaKu...' : 'Tulis pertanyaan Anda di sini...'}
                rows={5}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm transition resize-none ${
                  errors.message ? 'border-rose-300 bg-rose-50' : 'border-slate-200 bg-white hover:border-slate-300 focus:border-indigo-400'
                } outline-none focus:ring-2 focus:ring-indigo-100`}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.message && <p className="text-xs text-rose-500">{errors.message}</p>}
                <p className="text-xs text-slate-400 ml-auto">{form.message.length}/5000</p>
              </div>
            </div>

            {/* Error banner */}
            {mutation.isError && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm text-rose-700 flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Gagal mengirim. Periksa koneksi dan coba lagi.</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold rounded-xl shadow shadow-indigo-300/40 hover:shadow-md hover:shadow-indigo-400/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Mengirim...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Kirim
                </>
              )}
            </button>
          </form>
        )}
      </main>
    </div>
  )
}
