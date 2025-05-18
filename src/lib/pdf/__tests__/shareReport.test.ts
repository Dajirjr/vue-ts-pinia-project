import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { sharePDF, shareViaEmail, shareViaEmailService } from '../shareReport'

describe('PDF Sharing Functionality', () => {
  const mockBlob = new Blob(['test'], { type: 'application/pdf' })
  const mockFilename = 'test-report'

  beforeEach(() => {
    // Mock navigator.share
    Object.defineProperty(global.navigator, 'share', {
      value: vi.fn(),
      writable: true
    })

    // Mock navigator.clipboard
    Object.defineProperty(global.navigator, 'clipboard', {
      value: {
        write: vi.fn()
      },
      writable: true
    })

    // Mock window.open
    Object.defineProperty(global, 'open', {
      value: vi.fn(),
      writable: true
    })

    // Mock URL.createObjectURL and revokeObjectURL
    Object.defineProperty(global.URL, 'createObjectURL', {
      value: vi.fn(() => 'mock-url'),
      writable: true
    })
    Object.defineProperty(global.URL, 'revokeObjectURL', {
      value: vi.fn(),
      writable: true
    })

    // Mock fetch
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('sharePDF', () => {
    it('should share via email', async () => {
      await sharePDF(mockBlob, mockFilename, { method: 'email' })
      expect(navigator.share).toHaveBeenCalled()
    })

    it('should copy to clipboard', async () => {
      await sharePDF(mockBlob, mockFilename, { method: 'clipboard' })
      expect(navigator.clipboard.write).toHaveBeenCalled()
    })

    it('should handle print', async () => {
      const mockIframe = {
        style: {},
        contentWindow: {
          print: vi.fn()
        }
      }
      vi.spyOn(document, 'createElement').mockReturnValue(mockIframe as any)
      
      await sharePDF(mockBlob, mockFilename, { method: 'print' })
      expect(URL.createObjectURL).toHaveBeenCalledWith(mockBlob)
    })

    it('should share to social media', async () => {
      await sharePDF(mockBlob, mockFilename, { 
        method: 'social',
        socialPlatform: 'twitter',
        body: 'Test message'
      })
      expect(window.open).toHaveBeenCalled()
    })

    it('should throw error for unsupported method', async () => {
      await expect(sharePDF(mockBlob, mockFilename, { 
        method: 'invalid' as any 
      })).rejects.toThrow('Unsupported share method')
    })
  })

  describe('shareViaEmail', () => {
    it('should use Web Share API when available', async () => {
      Object.defineProperty(navigator, 'canShare', {
        value: () => true,
        writable: true
      })

      await shareViaEmail(mockBlob, mockFilename)
      expect(navigator.share).toHaveBeenCalled()
    })

    it('should fallback to mailto link', async () => {
      Object.defineProperty(navigator, 'canShare', {
        value: () => false,
        writable: true
      })

      const mockReader = {
        onload: null,
        readAsDataURL: vi.fn(function(this: any) {
          this.onload?.()
        }),
        result: 'data:application/pdf;base64,test'
      }
      vi.spyOn(window, 'FileReader').mockImplementation(() => mockReader as any)

      await shareViaEmail(mockBlob, mockFilename)
      expect(mockReader.readAsDataURL).toHaveBeenCalled()
    })
  })

  describe('shareViaEmailService', () => {
    it('should require recipient email', async () => {
      await expect(shareViaEmailService(mockBlob, mockFilename)).rejects.toThrow('Recipient email address is required')
    })

    it('should send email via service', async () => {
      const mockFetch = global.fetch as ReturnType<typeof vi.fn>
      mockFetch.mockResolvedValueOnce({ ok: true })

      await shareViaEmailService(mockBlob, mockFilename, {
        to: 'test@example.com'
      })
      expect(fetch).toHaveBeenCalledWith('/api/send-email', expect.any(Object))
    })

    it('should handle service errors', async () => {
      const mockFetch = global.fetch as ReturnType<typeof vi.fn>
      mockFetch.mockResolvedValueOnce({ 
        ok: false,
        statusText: 'Service Error'
      })

      await expect(shareViaEmailService(mockBlob, mockFilename, {
        to: 'test@example.com'
      })).rejects.toThrow('Failed to send email: Service Error')
    })
  })
}) 