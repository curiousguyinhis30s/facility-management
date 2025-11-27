'use client'

import React from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast/toast'
import { saveToStorage, loadFromStorage, StorageKeys } from '@/lib/storage'
import { ConfirmationModal, useConfirmation } from '@/components/ui/confirmation-modal'
import { CustomFields, CustomField, serializeCustomFields, deserializeCustomFields } from '@/components/ui/custom-fields'
import { FormSidePanel } from '@/components/ui/side-panel'

interface Canvas {
  id: string
  name: string
  type: 'floor-plan' | 'site-map' | 'diagram' | 'blank'
  description: string
  createdAt: Date
  updatedAt: Date
  thumbnail?: string
  notes?: string
  customFields?: Record<string, { value: string; type: string }>
}

const mockCanvases: Canvas[] = []

export default function CanvasPage() {
  const [canvases, setCanvases] = React.useState<Canvas[]>(() =>
    loadFromStorage(StorageKeys.CANVASES, mockCanvases)
  )
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingCanvas, setEditingCanvas] = React.useState<Canvas | null>(null)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState('all')
  const { showToast } = useToast()
  const { confirmState, showConfirmation, hideConfirmation } = useConfirmation()

  // Save to storage when canvases change
  React.useEffect(() => {
    saveToStorage(StorageKeys.CANVASES, canvases)
  }, [canvases])

  const filteredCanvases = React.useMemo(() => {
    return canvases.filter((canvas) => {
      const matchesSearch = canvas.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        canvas.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === 'all' || canvas.type === typeFilter
      return matchesSearch && matchesType
    })
  }, [canvases, searchTerm, typeFilter])

  const stats = {
    total: canvases.length,
    floorPlans: canvases.filter((c) => c.type === 'floor-plan').length,
    siteMaps: canvases.filter((c) => c.type === 'site-map').length,
    diagrams: canvases.filter((c) => c.type === 'diagram').length,
  }

  const handleCreateCanvas = (type: Canvas['type'] = 'blank') => {
    setEditingCanvas(null)
    setIsFormOpen(true)
  }

  const handleEditCanvas = (canvas: Canvas) => {
    setEditingCanvas(canvas)
    setIsFormOpen(true)
  }

  const handleDeleteCanvas = (id: string) => {
    const canvas = canvases.find((c) => c.id === id)
    showConfirmation({
      title: 'Delete Canvas',
      message: `Are you sure you want to delete "${canvas?.name}"? This action cannot be undone.`,
      type: 'danger',
      confirmText: 'Delete',
      onConfirm: () => {
        setCanvases(canvases.filter((c) => c.id !== id))
        showToast('Canvas deleted successfully', 'success')
      },
    })
  }

  const handleFormSubmit = (data: Partial<Canvas>) => {
    if (editingCanvas) {
      setCanvases(canvases.map((c) =>
        c.id === editingCanvas.id
          ? { ...c, ...data, updatedAt: new Date() }
          : c
      ))
      showToast('Canvas updated successfully', 'success')
    } else {
      const newCanvas: Canvas = {
        id: `canvas_${Date.now()}`,
        name: data.name || 'Untitled Canvas',
        type: data.type || 'blank',
        description: data.description || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        notes: data.notes,
        customFields: data.customFields,
      }
      setCanvases([...canvases, newCanvas])
      showToast('Canvas created successfully', 'success')
    }
    setIsFormOpen(false)
    setEditingCanvas(null)
  }

  const getTypeLabel = (type: Canvas['type']) => {
    const labels = {
      'floor-plan': 'Floor Plan',
      'site-map': 'Site Map',
      'diagram': 'Diagram',
      'blank': 'Blank Canvas',
    }
    return labels[type]
  }

  const getTypeColor = (type: Canvas['type']) => {
    const colors: Record<Canvas['type'], 'default' | 'success' | 'warning' | 'secondary'> = {
      'floor-plan': 'default',
      'site-map': 'success',
      'diagram': 'warning',
      'blank': 'secondary',
    }
    return colors[type]
  }

  return (
    <DashboardLayout
      title="Canvas"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="secondary">
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Import
          </Button>
          <Button variant="primary" onClick={() => handleCreateCanvas()}>
            <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Canvas
          </Button>
        </div>
      }
    >
      {/* Stats - Compact */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-black/50 uppercase tracking-wide">Total Canvases</div>
                <div className="mt-1 text-2xl font-semibold text-black">{stats.total}</div>
              </div>
              <div className="text-xs text-black/50">all types</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-black/50 uppercase tracking-wide">Floor Plans</div>
                <div className="mt-1 text-2xl font-semibold text-primary">{stats.floorPlans}</div>
              </div>
              <div className="text-xs text-black/50">layouts</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-black/50 uppercase tracking-wide">Site Maps</div>
                <div className="mt-1 text-2xl font-semibold text-success">{stats.siteMaps}</div>
              </div>
              <div className="text-xs text-black/50">maps</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-black/50 uppercase tracking-wide">Diagrams</div>
                <div className="mt-1 text-2xl font-semibold text-warning">{stats.diagrams}</div>
              </div>
              <div className="text-xs text-black/50">systems</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter - Compact inline */}
      <div className="flex items-center gap-3 mb-4 px-3 py-2 bg-black/[0.02] rounded-lg border border-black/[0.06]">
        <Input
          placeholder="Search canvases..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 max-w-xs h-8 text-sm"
        />
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={[
            { value: 'all', label: 'All Types' },
            { value: 'floor-plan', label: 'Floor Plans' },
            { value: 'site-map', label: 'Site Maps' },
            { value: 'diagram', label: 'Diagrams' },
            { value: 'blank', label: 'Blank Canvas' },
          ]}
          className="w-40 h-8 text-sm"
        />
        <span className="ml-auto text-xs text-black/50 whitespace-nowrap">
          {filteredCanvases.length} of {canvases.length}
        </span>
      </div>

      {/* Canvas Grid or Empty State */}
      {filteredCanvases.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCanvases.map((canvas) => (
            <Card key={canvas.id} className="group hover:border-primary/50 transition-colors">
              <CardContent className="p-0">
                {/* Canvas Preview - Compact */}
                <div className="aspect-[4/3] bg-black/[0.02] border-b border-black/[0.08] flex items-center justify-center">
                  {canvas.thumbnail ? (
                    <img src={canvas.thumbnail} alt={canvas.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-black/20">
                      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Canvas Info - Compact */}
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="text-sm font-medium text-black group-hover:text-primary transition-colors truncate">
                      {canvas.name}
                    </h3>
                    <Badge variant={getTypeColor(canvas.type)} className="text-[10px] shrink-0">
                      {getTypeLabel(canvas.type)}
                    </Badge>
                  </div>
                  <p className="text-xs text-black/50 mb-2 line-clamp-1">
                    {canvas.description || 'No description'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-black/40">
                      {new Date(canvas.updatedAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => handleEditCanvas(canvas)}
                        className="p-1 rounded text-black/40 hover:text-primary hover:bg-primary/10 transition-colors"
                        aria-label="Edit canvas"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteCanvas(canvas.id)}
                        className="p-1 rounded text-black/40 hover:text-danger hover:bg-danger/10 transition-colors"
                        aria-label="Delete canvas"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/[0.04] mb-3">
                <svg className="h-5 w-5 text-black/40" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-black mb-1">
                {searchTerm || typeFilter !== 'all' ? 'No canvases found' : 'No canvases yet'}
              </h3>
              <p className="text-xs text-black/50 max-w-xs mb-4">
                {searchTerm || typeFilter !== 'all'
                  ? 'Try adjusting your search or filter.'
                  : 'Create your first canvas for floor plans, site maps, and diagrams.'}
              </p>
              <Button variant="primary" className="h-8 text-sm px-3" onClick={() => handleCreateCanvas()}>
                <svg className="mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Canvas
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Canvas Templates - Compact */}
      <div className="mt-4">
        <h2 className="text-sm font-semibold text-black/70 mb-2">Quick Start Templates</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            {
              title: 'Floor Plan',
              type: 'floor-plan' as const,
              description: 'Create floor plans for properties',
              icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
              ),
            },
            {
              title: 'Site Map',
              type: 'site-map' as const,
              description: 'Map out property locations',
              icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                </svg>
              ),
            },
            {
              title: 'Blank Canvas',
              type: 'blank' as const,
              description: 'Start from scratch',
              icon: (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              ),
            },
          ].map((template) => (
            <Card
              key={template.title}
              className="cursor-pointer group hover:border-primary/50"
              onClick={() => {
                setEditingCanvas({ type: template.type } as any)
                setIsFormOpen(true)
              }}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-black/[0.04] text-black/40 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    {template.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-black group-hover:text-primary transition-colors truncate">
                      {template.title}
                    </h3>
                    <p className="text-xs text-black/50 truncate">
                      {template.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Canvas Form Modal */}
      {isFormOpen && (
        <CanvasFormModal
          canvas={editingCanvas}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setIsFormOpen(false)
            setEditingCanvas(null)
          }}
        />
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmState.isOpen}
        onClose={hideConfirmation}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        type={confirmState.type}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
      />
    </DashboardLayout>
  )
}

// Canvas Form Side Panel Component
function CanvasFormModal({
  canvas,
  onSubmit,
  onClose,
}: {
  canvas: Canvas | null
  onSubmit: (data: Partial<Canvas>) => void
  onClose: () => void
}) {
  const [formData, setFormData] = React.useState({
    name: canvas?.name || '',
    type: canvas?.type || 'blank',
    description: canvas?.description || '',
    notes: canvas?.notes || '',
  })

  const [customFields, setCustomFields] = React.useState<CustomField[]>(
    deserializeCustomFields(canvas?.customFields)
  )

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onSubmit({
      ...formData,
      type: formData.type as Canvas['type'],
      customFields: serializeCustomFields(customFields),
    })
    setIsSubmitting(false)
  }

  return (
    <FormSidePanel
      isOpen={true}
      onClose={onClose}
      title={canvas?.id ? 'Edit Canvas' : 'Create New Canvas'}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitText={canvas?.id ? 'Update' : 'Create'}
      width="md"
    >
      {/* Basic Info - Compact Row */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-black/70 mb-1">
            Canvas Name <span className="text-danger">*</span>
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Building A Floor Plan"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black/70 mb-1">
            Canvas Type
          </label>
          <Select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as Canvas['type'] })}
            options={[
              { value: 'floor-plan', label: 'Floor Plan' },
              { value: 'site-map', label: 'Site Map' },
              { value: 'diagram', label: 'Diagram' },
              { value: 'blank', label: 'Blank Canvas' },
            ]}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-black/70 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of this canvas..."
          rows={2}
          className="w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm text-black placeholder:text-black/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-black/70 mb-1">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Internal notes..."
          rows={2}
          className="w-full rounded-lg border border-black/20 bg-white px-3 py-2 text-sm text-black placeholder:text-black/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
        />
      </div>

      {/* Custom Fields */}
      <div className="border-t border-black/[0.08] pt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-black">Custom Fields</h3>
          <span className="text-xs text-black/50">{customFields.length}/10</span>
        </div>
        <CustomFields
          fields={customFields}
          onChange={setCustomFields}
          maxFields={10}
        />
      </div>
    </FormSidePanel>
  )
}
