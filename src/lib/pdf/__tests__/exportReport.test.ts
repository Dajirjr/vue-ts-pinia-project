import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { exportReport, exportReportToBlob, type PDFExportOptions } from '../exportReport'

// Mock html2pdf
vi.mock('html2pdf.js', () => ({
  default: () => ({
    set: (options: any) => ({
      from: () => ({
        save: () => Promise.resolve(),
        output: (type: string) => Promise.resolve(new Blob(['test']))
      }),
      _options: options // Store options for testing
    })
  })
}))

describe('PDF Export Functionality', () => {
  let mockElement: HTMLDivElement
  let html2pdf: any

  beforeEach(() => {
    // Create a mock element
    mockElement = document.createElement('div')
    mockElement.id = 'test-report'
    document.body.appendChild(mockElement)
  })

  afterEach(() => {
    // Clean up
    document.body.removeChild(mockElement)
    vi.clearAllMocks()
  })

  describe('exportReport', () => {
    it('should throw error if element not found', async () => {
      await expect(exportReport('non-existent')).rejects.toThrow('No element found')
    })

    it('should export PDF with default options', async () => {
      await expect(exportReport('test-report')).resolves.not.toThrow()
    })

    it('should add watermark when specified', async () => {
      const options: PDFExportOptions = {
        watermark: 'TEST'
      }
      await exportReport('test-report', options)
      
      // Verify watermark was added and removed
      expect(mockElement.children.length).toBe(0)
    })

    it('should handle custom options', async () => {
      const options: PDFExportOptions = {
        filename: 'test',
        pageSize: 'a4',
        orientation: 'landscape',
        margin: 1,
        scale: 3
      }
      await expect(exportReport('test-report', options)).resolves.not.toThrow()
    })

    it('should add header and footer when specified', async () => {
      const options: PDFExportOptions = {
        headerText: 'Test Header',
        footerText: 'Test Footer'
      }
      await exportReport('test-report', options)
      expect(mockElement.children.length).toBe(0)
    })

    it('should apply dark theme when specified', async () => {
      const options: PDFExportOptions = {
        theme: 'dark'
      }
      await exportReport('test-report', options)
      expect(mockElement.style.backgroundColor).toBe('')
      expect(mockElement.style.color).toBe('')
    })

    it('should handle metadata options', async () => {
      const options: PDFExportOptions = {
        metadata: {
          title: 'Test Title',
          author: 'Test Author',
          subject: 'Test Subject',
          keywords: ['test', 'pdf']
        }
      }
      await exportReport('test-report', options)
    })

    it('should handle password protection', async () => {
      const options: PDFExportOptions = {
        password: 'test123'
      }
      await exportReport('test-report', options)
    })

    it('should handle quality settings', async () => {
      const options: PDFExportOptions = {
        quality: 0.8
      }
      await exportReport('test-report', options)
    })

    it('should handle compression settings', async () => {
      const options: PDFExportOptions = {
        compression: false
      }
      await exportReport('test-report', options)
    })
  })

  describe('exportReportToBlob', () => {
    it('should throw error if element not found', async () => {
      await expect(exportReportToBlob('non-existent')).rejects.toThrow('No element found')
    })

    it('should return a Blob', async () => {
      const blob = await exportReportToBlob('test-report')
      expect(blob).toBeInstanceOf(Blob)
    })

    it('should handle custom options', async () => {
      const options: PDFExportOptions = {
        pageSize: 'a4',
        orientation: 'landscape',
        quality: 0.9,
        compression: true,
        metadata: {
          title: 'Test Report'
        }
      }
      const blob = await exportReportToBlob('test-report', options)
      expect(blob).toBeInstanceOf(Blob)
    })

    it('should handle errors gracefully', async () => {
      // Mock a failure
      vi.mock('html2pdf.js', () => ({
        default: () => ({
          set: () => ({
            from: () => ({
              output: () => Promise.reject(new Error('Test error'))
            })
          })
        })
      }))

      await expect(exportReportToBlob('test-report')).rejects.toThrow('Test error')
    })
  })
}) 