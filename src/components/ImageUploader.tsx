// @ts-nocheck
'use client'

import { useRef, useState, useCallback } from 'react'
import type { ProductImage } from '@/lib/catalog-store' // type-only import — keep
import { uploadFile } from '@/lib/upload'

const UploadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)
const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
)
const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const SpinnerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
)

function uid() {
  return Math.random().toString(36).slice(2, 10)
}

/* ── Main Image ─────────────────────────────────────── */
interface MainImageUploadProps {
  image: ProductImage | null
  onChange: (img: ProductImage | null) => void
  shopId: string
  productId: string
}

export function MainImageUpload({ image, onChange, shopId, productId }: MainImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const doUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    try {
      const result = await uploadFile(file, shopId, 'products', productId)
      onChange({ id: uid(), url: result.url, name: image?.name || file.name.replace(/\.[^.]+$/, '') })
    } catch (err) {
      console.error('[MainImageUpload] upload failed:', err)
      alert('Image upload failed: ' + (err?.message || 'Unknown error'))
    } finally {
      setUploading(false)
    }
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await doUpload(file)
    e.target.value = ''
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) doUpload(file)
  }, [shopId, productId])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  return (
    <div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Main Image</div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Preview / upload zone */}
        <div
          onClick={() => !image && !uploading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            width: 120, height: 120, borderRadius: 10, flexShrink: 0,
            border: `2px dashed ${dragOver ? 'var(--accent, #006AFF)' : image ? 'transparent' : 'var(--border)'}`,
            background: dragOver ? 'rgba(0,106,255,0.06)' : image ? 'transparent' : 'var(--bg)',
            overflow: 'hidden', cursor: image ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', transition: 'border-color .15s, background .15s',
          }}
        >
          {uploading
            ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
                <SpinnerIcon />
                <span style={{ fontSize: 10 }}>Uploading...</span>
              </div>
            : image
              ? <img src={image.url} alt={image.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
              : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}>
                  <UploadIcon />
                  <span style={{ fontSize: 11, textAlign: 'center', lineHeight: 1.4 }}>Click or drop</span>
                </div>
          }
        </div>

        {/* Name + actions */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Image Name</label>
            <input
              className="form-input"
              value={image?.name || ''}
              onChange={e => image && onChange({ ...image, name: e.target.value })}
              placeholder="e.g. Front view"
              disabled={!image}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn-secondary" onClick={() => inputRef.current?.click()} disabled={uploading} style={{ fontSize: 12, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 5, opacity: uploading ? 0.5 : 1 }}>
              <UploadIcon /> {image ? 'Change' : 'Upload'}
            </button>
            {image && (
              <button type="button" onClick={() => onChange(null)} style={{ fontSize: 12, padding: '5px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <TrashIcon /> Remove
              </button>
            )}
          </div>
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  )
}

/* ── Variant Images ─────────────────────────────────── */
interface VariantImagesUploadProps {
  images: ProductImage[]
  onChange: (imgs: ProductImage[]) => void
  shopId: string
  productId: string
}

export function VariantImagesUpload({ images, onChange, shopId, productId }: VariantImagesUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const doUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return
    setUploading(true)
    try {
      const result = await uploadFile(file, shopId, 'products', productId)
      onChange([...images, { id: uid(), url: result.url, name: file.name.replace(/\.[^.]+$/, '') }])
    } catch (err) {
      console.error('[VariantImagesUpload] upload failed:', err)
      alert('Image upload failed: ' + (err?.message || 'Unknown error'))
    } finally {
      setUploading(false)
    }
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await doUpload(file)
    e.target.value = ''
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) doUpload(file)
  }, [images, shopId, productId])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const updateName = (id: string, name: string) => {
    onChange(images.map(img => img.id === id ? { ...img, name } : img))
  }

  const remove = (id: string) => {
    onChange(images.filter(img => img.id !== id))
  }

  return (
    <div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Variant Images</div>
        <button type="button" className="btn-secondary" onClick={() => inputRef.current?.click()} disabled={uploading} style={{ fontSize: 12, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 4, opacity: uploading ? 0.5 : 1 }}>
          {uploading ? <SpinnerIcon /> : <PlusIcon />} {uploading ? 'Uploading...' : 'Add'}
        </button>
      </div>

      {images.length === 0 && !uploading && (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            border: `2px dashed ${dragOver ? 'var(--accent, #006AFF)' : 'var(--border)'}`,
            background: dragOver ? 'rgba(0,106,255,0.06)' : 'transparent',
            borderRadius: 10, padding: '20px', textAlign: 'center', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: 12.5, transition: 'border-color .15s, background .15s',
          }}
        >
          No variants yet — click Add, or drag and drop here
        </div>
      )}

      {uploading && images.length === 0 && (
        <div style={{ border: '2px dashed var(--border)', borderRadius: 10, padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 12.5 }}>
          <SpinnerIcon /> Uploading...
        </div>
      )}

      <div
        style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        onDrop={images.length > 0 ? handleDrop : undefined}
        onDragOver={images.length > 0 ? handleDragOver : undefined}
        onDragLeave={images.length > 0 ? handleDragLeave : undefined}
      >
        {images.map((img, idx) => (
          <div key={img.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 12px', background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
            {/* Thumbnail */}
            <div style={{ width: 52, height: 52, borderRadius: 6, overflow: 'hidden', flexShrink: 0, background: 'var(--border)' }}>
              <img src={img.url} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Index + name */}
            <div style={{ fontSize: 11, color: 'var(--text-muted)', minWidth: 20 }}>#{idx + 1}</div>
            <input
              className="form-input"
              value={img.name}
              onChange={e => updateName(img.id, e.target.value)}
              placeholder="Variant name…"
              style={{ flex: 1 }}
            />

            {/* Remove */}
            <button type="button" onClick={() => remove(img.id)} style={{ padding: '5px 8px', borderRadius: 6, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
              <TrashIcon />
            </button>
          </div>
        ))}
        {uploading && images.length > 0 && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '10px 12px', background: 'var(--bg)', borderRadius: 8, border: '1px dashed var(--border)', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 12 }}>
            <SpinnerIcon /> Uploading...
          </div>
        )}
      </div>

      {images.length > 0 && dragOver && (
        <div style={{ marginTop: 8, border: '2px dashed var(--accent, #006AFF)', background: 'rgba(0,106,255,0.06)', borderRadius: 10, padding: '12px', textAlign: 'center', color: 'var(--accent, #006AFF)', fontSize: 12 }}>
          Drop image here to add
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
    </div>
  )
}
