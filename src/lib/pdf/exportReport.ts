import html2pdf from 'html2pdf.js'
import type { jsPDF } from 'jspdf'

export interface PDFExportOptions {
  filename?: string
  pageSize?: 'letter' | 'a4' | 'legal' | 'tabloid'
  orientation?: 'portrait' | 'landscape'
  margin?: number
  scale?: number
  watermark?: string
  headerText?: string
  footerText?: string
  theme?: 'light' | 'dark'
  quality?: number
  password?: string
  compression?: boolean
  metadata?: {
    title?: string
    author?: string
    subject?: string
    keywords?: string[]
  }
}

const defaultOptions: Required<PDFExportOptions> = {
  filename: 'weekly-report',
  pageSize: 'letter',
  orientation: 'portrait',
  margin: 0.5,
  scale: 2,
  watermark: '',
  headerText: '',
  footerText: '',
  theme: 'light',
  quality: 0.95,
  password: '',
  compression: true,
  metadata: {
    title: '',
    author: '',
    subject: '',
    keywords: []
  }
}

export async function exportReport(
  elementId: string,
  options: PDFExportOptions = {}
): Promise<void> {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`No element found with ID ${elementId}`)
  }

  const mergedOptions = { ...defaultOptions, ...options }
  const filename = `${mergedOptions.filename}-${new Date().toISOString().split('T')[0]}.pdf`

  try {
    // Add watermark if specified
    let watermarkElement: HTMLDivElement | null = null
    if (mergedOptions.watermark) {
      watermarkElement = document.createElement('div')
      watermarkElement.style.position = 'absolute'
      watermarkElement.style.top = '50%'
      watermarkElement.style.left = '50%'
      watermarkElement.style.transform = 'translate(-50%, -50%) rotate(-45deg)'
      watermarkElement.style.fontSize = '60px'
      watermarkElement.style.opacity = '0.1'
      watermarkElement.style.pointerEvents = 'none'
      watermarkElement.style.zIndex = '1000'
      watermarkElement.innerText = mergedOptions.watermark
      element.style.position = 'relative'
      element.appendChild(watermarkElement)
    }

    // Add header if specified
    let headerElement: HTMLDivElement | null = null
    if (mergedOptions.headerText) {
      headerElement = document.createElement('div')
      headerElement.style.position = 'fixed'
      headerElement.style.top = '0'
      headerElement.style.left = '0'
      headerElement.style.right = '0'
      headerElement.style.padding = '10px'
      headerElement.style.textAlign = 'center'
      headerElement.style.fontSize = '12px'
      headerElement.style.borderBottom = '1px solid #eee'
      headerElement.innerText = mergedOptions.headerText
      element.insertBefore(headerElement, element.firstChild)
    }

    // Add footer if specified
    let footerElement: HTMLDivElement | null = null
    if (mergedOptions.footerText) {
      footerElement = document.createElement('div')
      footerElement.style.position = 'fixed'
      footerElement.style.bottom = '0'
      footerElement.style.left = '0'
      footerElement.style.right = '0'
      footerElement.style.padding = '10px'
      footerElement.style.textAlign = 'center'
      footerElement.style.fontSize = '12px'
      footerElement.style.borderTop = '1px solid #eee'
      footerElement.innerText = mergedOptions.footerText
      element.appendChild(footerElement)
    }

    // Apply theme
    if (mergedOptions.theme === 'dark') {
      element.style.backgroundColor = '#1a1a1a'
      element.style.color = '#ffffff'
    }

    const opt = {
      margin: mergedOptions.margin,
      filename,
      image: { 
        type: 'jpeg', 
        quality: mergedOptions.quality
      },
      html2canvas: {
        scale: mergedOptions.scale,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: mergedOptions.theme === 'dark' ? '#1a1a1a' : '#ffffff'
      },
      jsPDF: {
        unit: 'in',
        format: mergedOptions.pageSize,
        orientation: mergedOptions.orientation,
        compress: mergedOptions.compression,
        encryption: mergedOptions.password ? {
          userPassword: mergedOptions.password,
          ownerPassword: mergedOptions.password,
          userPermissions: ['print', 'modify', 'copy', 'annot-forms']
        } : undefined,
        ...mergedOptions.metadata
      }
    }

    await html2pdf().set(opt).from(element).save()

    // Clean up elements
    if (watermarkElement) {
      element.removeChild(watermarkElement)
    }
    if (headerElement) {
      element.removeChild(headerElement)
    }
    if (footerElement) {
      element.removeChild(footerElement)
    }

    // Reset theme if dark
    if (mergedOptions.theme === 'dark') {
      element.style.backgroundColor = ''
      element.style.color = ''
    }
  } catch (error) {
    console.error('PDF export failed:', error)
    throw new Error(
      error instanceof Error 
        ? `Failed to export PDF: ${error.message}`
        : 'Failed to export PDF: Unknown error'
    )
  }
}

export async function exportReportToBlob(
  elementId: string,
  options: PDFExportOptions = {}
): Promise<Blob> {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`No element found with ID ${elementId}`)
  }

  const mergedOptions = { ...defaultOptions, ...options }

  try {
    const opt = {
      margin: mergedOptions.margin,
      image: { 
        type: 'jpeg', 
        quality: 0.98 
      },
      html2canvas: {
        scale: mergedOptions.scale,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff'
      },
      jsPDF: {
        unit: 'in',
        format: mergedOptions.pageSize,
        orientation: mergedOptions.orientation,
        compress: true
      }
    }

    return await html2pdf().set(opt).from(element).output('blob')
  } catch (error) {
    console.error('PDF export to blob failed:', error)
    throw new Error(
      error instanceof Error 
        ? `Failed to create PDF blob: ${error.message}`
        : 'Failed to create PDF blob: Unknown error'
    )
  }
} 