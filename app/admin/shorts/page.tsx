'use client';

import { useEffect, useState, useCallback } from 'react';
import { Short, getAllShorts, createShort, updateShort, deleteShort } from '@/lib/vtagu.api';
import { getShortThumbnailUrl } from '@/lib/video-utils';

// ─── Types ────────────────────────────────────────────────────────────────────

type ShortFormData = {
  title: string;
  slug: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration: string;
  languages: string;
  genre_id: string;
  is_free: boolean;
  is_featured: boolean;
  is_active: boolean;
  sort_order: string;
};

const defaultForm: ShortFormData = {
  title: '',
  slug: '',
  description: '',
  video_url: '',
  thumbnail_url: '',
  duration: '',
  languages: '',
  genre_id: '',
  is_free: true,
  is_featured: false,
  is_active: true,
  sort_order: '0',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function formatViews(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#18181b',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20,
          width: '100%', maxWidth: 640,
          maxHeight: '90vh', overflowY: 'auto',
          padding: 32,
          boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 28,
        }}>
          <h2 style={{ color: '#fff', margin: 0, fontSize: 20, fontWeight: 700 }}>{title}</h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
            cursor: 'pointer', fontSize: 24, lineHeight: 1, padding: 4,
          }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, required, children }: FieldProps) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{
        display: 'block', color: 'rgba(255,255,255,0.6)',
        fontSize: 12, fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: 0.8, marginBottom: 8,
      }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 10,
  color: '#fff',
  fontSize: 14,
  padding: '10px 14px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

// ─── Short Form ───────────────────────────────────────────────────────────────

interface ShortFormProps {
  form: ShortFormData;
  onChange: (field: keyof ShortFormData, value: string | boolean) => void;
  onSubmit: () => void;
  onCancel: () => void;
  saving: boolean;
  isEdit: boolean;
}

function ShortForm({ form, onChange, onSubmit, onCancel, saving, isEdit }: ShortFormProps) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <Field label="Title" required>
            <input
              style={inputStyle}
              value={form.title}
              placeholder="Short video title"
              onChange={(e) => {
                onChange('title', e.target.value);
                if (!isEdit) onChange('slug', slugify(e.target.value));
              }}
            />
          </Field>
        </div>

        <Field label="Slug">
          <input
            style={inputStyle}
            value={form.slug}
            placeholder="url-friendly-slug"
            onChange={(e) => onChange('slug', slugify(e.target.value))}
          />
        </Field>

        <Field label="Duration">
          <input
            style={inputStyle}
            value={form.duration}
            placeholder="e.g. 0:45"
            onChange={(e) => onChange('duration', e.target.value)}
          />
        </Field>

        <div style={{ gridColumn: '1 / -1' }}>
          <Field label="Video URL" required>
            <input
              style={inputStyle}
              value={form.video_url}
              placeholder="e.g. MP4, HLS (.m3u8), YouTube, or Rumble URL"
              onChange={(e) => onChange('video_url', e.target.value)}
            />
          </Field>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <Field label="Thumbnail URL">
            <input
              style={inputStyle}
              value={form.thumbnail_url}
              placeholder="https://cdn.example.com/thumb.jpg"
              onChange={(e) => onChange('thumbnail_url', e.target.value)}
            />
          </Field>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <Field label="Description">
            <textarea
              style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }}
              value={form.description}
              placeholder="Short description..."
              onChange={(e) => onChange('description', e.target.value)}
            />
          </Field>
        </div>

        <Field label="Languages">
          <input
            style={inputStyle}
            value={form.languages}
            placeholder="e.g. Tamil, English"
            onChange={(e) => onChange('languages', e.target.value)}
          />
        </Field>

        <Field label="Sort Order">
          <input
            style={inputStyle}
            type="number"
            value={form.sort_order}
            onChange={(e) => onChange('sort_order', e.target.value)}
          />
        </Field>
      </div>

      {/* Toggles */}
      <div style={{ display: 'flex', gap: 24, marginTop: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {(['is_free', 'is_featured', 'is_active'] as const).map((key) => (
          <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
            <div
              onClick={() => onChange(key, !form[key])}
              style={{
                width: 44, height: 24, borderRadius: 12,
                background: form[key] ? 'linear-gradient(135deg, #3299ff, #9248ff)' : 'rgba(255,255,255,0.1)',
                position: 'relative', cursor: 'pointer', transition: 'background 0.2s',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div style={{
                position: 'absolute',
                top: 2, left: form[key] ? 22 : 2,
                width: 18, height: 18, borderRadius: '50%',
                background: '#fff', transition: 'left 0.2s',
              }} />
            </div>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 500 }}>
              {key === 'is_free' ? 'Free' : key === 'is_featured' ? 'Featured' : 'Active'}
            </span>
          </label>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button
          onClick={onCancel}
          style={{
            padding: '10px 24px', borderRadius: 10,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff', cursor: 'pointer', fontSize: 14,
          }}
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          disabled={saving || !form.title || !form.video_url}
          style={{
            padding: '10px 28px', borderRadius: 10,
            background: saving ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #3299ff, #9248ff)',
            border: 'none', color: '#fff', cursor: saving ? 'default' : 'pointer',
            fontSize: 14, fontWeight: 700,
            opacity: (!form.title || !form.video_url) ? 0.5 : 1,
          }}
        >
          {saving ? 'Saving…' : isEdit ? 'Update Short' : 'Create Short'}
        </button>
      </div>
    </div>
  );
}

// ─── Delete Confirmation ──────────────────────────────────────────────────────

interface DeleteConfirmProps {
  short: Short;
  onConfirm: () => void;
  onCancel: () => void;
  deleting: boolean;
}

function DeleteConfirm({ short, onConfirm, onCancel, deleting }: DeleteConfirmProps) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🗑️</div>
      <p style={{ color: '#fff', fontSize: 16, marginBottom: 8 }}>
        Delete <strong>"{short.title}"</strong>?
      </p>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 28 }}>
        This action cannot be undone.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button onClick={onCancel} style={{
          padding: '10px 24px', borderRadius: 10,
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff', cursor: 'pointer', fontSize: 14,
        }}>
          Cancel
        </button>
        <button onClick={onConfirm} disabled={deleting} style={{
          padding: '10px 24px', borderRadius: 10,
          background: deleting ? 'rgba(239,68,68,0.3)' : '#ef4444',
          border: 'none', color: '#fff', cursor: deleting ? 'default' : 'pointer',
          fontSize: 14, fontWeight: 700,
        }}>
          {deleting ? 'Deleting…' : 'Yes, Delete'}
        </button>
      </div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────

export default function AdminShortsPage() {
  const [shorts, setShorts] = useState<Short[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [editShort, setEditShort] = useState<Short | null>(null);
  const [deleteShortItem, setDeleteShortItem] = useState<Short | null>(null);

  const [form, setForm] = useState<ShortFormData>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllShorts();
      setShorts(data);
    } catch {
      setError('Failed to load shorts. Make sure you are logged in as admin.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleFormChange = (field: keyof ShortFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openCreate = () => {
    setForm(defaultForm);
    setShowCreate(true);
  };

  const openEdit = (s: Short) => {
    setEditShort(s);
    setForm({
      title: s.title || '',
      slug: s.slug || '',
      description: s.description || '',
      video_url: s.video_url || '',
      thumbnail_url: s.thumbnail_url || '',
      duration: s.duration || '',
      languages: s.languages || '',
      genre_id: s.genre_id ? String(s.genre_id) : '',
      is_free: s.is_free,
      is_featured: s.is_featured,
      is_active: s.is_active,
      sort_order: String(s.sort_order ?? 0),
    });
  };

  const handleCreate = async () => {
    setSaving(true);
    try {
      const res = await createShort({
        ...form,
        genre_id: form.genre_id ? Number(form.genre_id) : undefined,
        sort_order: Number(form.sort_order),
      });
      if (res.status) {
        showToast('Short created successfully!');
        setShowCreate(false);
        load();
      } else {
        showToast(res.message || 'Failed to create', 'error');
      }
    } catch {
      showToast('An error occurred', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editShort) return;
    setSaving(true);
    try {
      const res = await updateShort(editShort.id, {
        ...form,
        genre_id: form.genre_id ? Number(form.genre_id) : undefined,
        sort_order: Number(form.sort_order),
      });
      if (res.status) {
        showToast('Short updated successfully!');
        setEditShort(null);
        load();
      } else {
        showToast(res.message || 'Failed to update', 'error');
      }
    } catch {
      showToast('An error occurred', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteShortItem) return;
    setDeleting(true);
    try {
      const res = await deleteShort(deleteShortItem.id);
      if (res.status) {
        showToast('Short deleted.');
        setDeleteShortItem(null);
        load();
      } else {
        showToast(res.message || 'Failed to delete', 'error');
      }
    } catch {
      showToast('An error occurred', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0c',
      color: '#fff',
      fontFamily: 'var(--font-montserrat), sans-serif',
    }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 9999,
          padding: '14px 22px', borderRadius: 12,
          background: toast.type === 'success'
            ? 'linear-gradient(135deg, #3299ff, #9248ff)'
            : '#ef4444',
          color: '#fff', fontWeight: 700, fontSize: 14,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          animation: 'slideIn 0.3s ease',
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{
        background: 'rgba(20,20,24,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '20px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>
            <span style={{
              background: 'linear-gradient(135deg, #3299ff, #9248ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Vtagu</span> Shorts Admin
          </h1>
          <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
            Manage vertical short video content
          </p>
        </div>
        <button
          onClick={openCreate}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '11px 22px', borderRadius: 12,
            background: 'linear-gradient(135deg, #3299ff, #9248ff)',
            border: 'none', color: '#fff', cursor: 'pointer',
            fontSize: 14, fontWeight: 700,
            boxShadow: '0 4px 16px rgba(50,153,255,0.3)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Short
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>

        {/* Stats bar */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 16, marginBottom: 32,
        }}>
          {[
            { label: 'Total', value: shorts.length, icon: '🎬' },
            { label: 'Active', value: shorts.filter(s => s.is_active).length, icon: '✅' },
            { label: 'Free', value: shorts.filter(s => s.is_free).length, icon: '🆓' },
            { label: 'Featured', value: shorts.filter(s => s.is_featured).length, icon: '⭐' },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: '#141418',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14, padding: '20px 22px',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{ fontSize: 28 }}>{stat.icon}</div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.4)' }}>
            Loading shorts…
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 12, padding: '16px 20px', color: '#ef4444', marginBottom: 24,
          }}>
            {error}
          </div>
        )}

        {!loading && !error && shorts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 16 }}>No shorts yet. Create your first one!</p>
          </div>
        )}

        {/* Shorts Grid */}
        {!loading && shorts.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Thumbnail', 'Title', 'Duration', 'Views', 'Status', 'Order', 'Actions'].map((h) => (
                    <th key={h} style={{
                      color: 'rgba(255,255,255,0.4)', fontWeight: 600,
                      textTransform: 'uppercase', fontSize: 11, letterSpacing: 0.8,
                      padding: '12px 16px', textAlign: 'left',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shorts.map((s, i) => (
                  <tr
                    key={s.id}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                      transition: 'background 0.2s',
                    }}
                  >
                    {/* Thumbnail */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{
                        width: 48, height: 76, borderRadius: 8, overflow: 'hidden',
                        background: '#27272a', flexShrink: 0,
                      }}>
                        <img
                          src={getShortThumbnailUrl(s, i)}
                          alt={s.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    </td>

                    {/* Title */}
                    <td style={{ padding: '12px 16px', maxWidth: 260 }}>
                      <div style={{ fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                        {s.title}
                      </div>
                      {s.description && (
                        <div style={{
                          color: 'rgba(255,255,255,0.4)', fontSize: 12,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          maxWidth: 220,
                        }}>
                          {s.description}
                        </div>
                      )}
                    </td>

                    {/* Duration */}
                    <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)' }}>
                      {s.duration || '—'}
                    </td>

                    {/* Views */}
                    <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.6)' }}>
                      {formatViews(s.view_count)}
                    </td>

                    {/* Status badges */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        <span style={{
                          padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                          background: s.is_active ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                          color: s.is_active ? '#4ade80' : '#f87171',
                          border: `1px solid ${s.is_active ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                        }}>
                          {s.is_active ? 'Active' : 'Inactive'}
                        </span>
                        {s.is_free && (
                          <span style={{
                            padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                            background: 'rgba(59,130,246,0.15)', color: '#93c5fd',
                            border: '1px solid rgba(59,130,246,0.3)',
                          }}>Free</span>
                        )}
                        {s.is_featured && (
                          <span style={{
                            padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                            background: 'rgba(251,191,36,0.15)', color: '#fbbf24',
                            border: '1px solid rgba(251,191,36,0.3)',
                          }}>⭐ Featured</span>
                        )}
                      </div>
                    </td>

                    {/* Sort order */}
                    <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
                      {s.sort_order}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => openEdit(s)}
                          style={{
                            padding: '7px 14px', borderRadius: 8,
                            background: 'rgba(50,153,255,0.1)',
                            border: '1px solid rgba(50,153,255,0.3)',
                            color: '#3299ff', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteShortItem(s)}
                          style={{
                            padding: '7px 14px', borderRadius: 8,
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Short">
        <ShortForm
          form={form}
          onChange={handleFormChange}
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
          saving={saving}
          isEdit={false}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editShort} onClose={() => setEditShort(null)} title="Edit Short">
        <ShortForm
          form={form}
          onChange={handleFormChange}
          onSubmit={handleUpdate}
          onCancel={() => setEditShort(null)}
          saving={saving}
          isEdit
        />
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteShortItem} onClose={() => setDeleteShortItem(null)} title="Confirm Delete">
        {deleteShortItem && (
          <DeleteConfirm
            short={deleteShortItem}
            onConfirm={handleDelete}
            onCancel={() => setDeleteShortItem(null)}
            deleting={deleting}
          />
        )}
      </Modal>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
