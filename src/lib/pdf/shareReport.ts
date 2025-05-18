interface EmailOptions {
  to?: string
  subject?: string
  body?: string
}

interface ShareOptions extends EmailOptions {
  method?: 'email' | 'download' | 'clipboard' | 'print' | 'social'
  socialPlatform?: 'twitter' | 'linkedin' | 'facebook'
  customEndpoint?: string
}

const defaultEmailOptions: Required<EmailOptions> = {
  to: '',
  subject: 'Weekly Productivity Report',
  body: 'Please find attached your weekly productivity report.'
}

const defaultShareOptions: Required<ShareOptions> = {
  ...defaultEmailOptions,
  method: 'email',
  socialPlatform: 'twitter',
  customEndpoint: ''
}

/**
 * Share PDF report via various methods
 */
export async function sharePDF(
  pdfBlob: Blob,
  filename: string,
  options: ShareOptions = {}
): Promise<void> {
  const mergedOptions = { ...defaultShareOptions, ...options }

  switch (mergedOptions.method) {
    case 'email':
      await shareViaEmail(pdfBlob, filename, mergedOptions)
      break
    case 'download':
      await downloadPDF(pdfBlob, filename)
      break
    case 'clipboard':
      await copyToClipboard(pdfBlob)
      break
    case 'print':
      await printPDF(pdfBlob)
      break
    case 'social':
      await shareToSocial(pdfBlob, filename, mergedOptions)
      break
    default:
      throw new Error(`Unsupported share method: ${mergedOptions.method}`)
  }
}

/**
 * Share PDF report via email using the system's default email client
 * or web email interface if available.
 */
export async function shareViaEmail(
  pdfBlob: Blob,
  filename: string,
  options: EmailOptions = {}
): Promise<void> {
  const mergedOptions = { ...defaultEmailOptions, ...options }
  
  try {
    // Try using the Web Share API if available
    if (navigator.share && navigator.canShare) {
      const file = new File([pdfBlob], `${filename}.pdf`, { type: 'application/pdf' })
      
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: mergedOptions.subject,
          text: mergedOptions.body
        })
        return
      }
    }

    // Fallback to mailto: link with data URL
    const reader = new FileReader()
    reader.onload = () => {
      const base64data = reader.result?.toString().split(',')[1]
      const mailtoLink = `mailto:${mergedOptions.to}?subject=${encodeURIComponent(
        mergedOptions.subject
      )}&body=${encodeURIComponent(
        mergedOptions.body
      )}&attachment=${base64data};filename=${filename}.pdf`

      // Open the mailto link
      window.location.href = mailtoLink
    }
    reader.readAsDataURL(pdfBlob)
  } catch (error) {
    console.error('Failed to share via email:', error)
    throw new Error(
      error instanceof Error 
        ? `Failed to share via email: ${error.message}`
        : 'Failed to share via email: Unknown error'
    )
  }
}

/**
 * Download PDF directly
 */
async function downloadPDF(pdfBlob: Blob, filename: string): Promise<void> {
  try {
    const url = URL.createObjectURL(pdfBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${filename}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to download PDF:', error)
    throw new Error(
      error instanceof Error 
        ? `Failed to download PDF: ${error.message}`
        : 'Failed to download PDF: Unknown error'
    )
  }
}

/**
 * Copy PDF to clipboard
 */
async function copyToClipboard(pdfBlob: Blob): Promise<void> {
  try {
    if (navigator.clipboard && navigator.clipboard.write) {
      const clipboardItem = new ClipboardItem({
        'application/pdf': pdfBlob
      })
      await navigator.clipboard.write([clipboardItem])
    } else {
      throw new Error('Clipboard API not supported')
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    throw new Error(
      error instanceof Error 
        ? `Failed to copy to clipboard: ${error.message}`
        : 'Failed to copy to clipboard: Unknown error'
    )
  }
}

/**
 * Print PDF
 */
async function printPDF(pdfBlob: Blob): Promise<void> {
  try {
    const url = URL.createObjectURL(pdfBlob)
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = url
    document.body.appendChild(iframe)

    iframe.onload = () => {
      try {
        iframe.contentWindow?.print()
      } catch (e) {
        console.error('Print failed:', e)
      }
      document.body.removeChild(iframe)
      URL.revokeObjectURL(url)
    }
  } catch (error) {
    console.error('Failed to print PDF:', error)
    throw new Error(
      error instanceof Error 
        ? `Failed to print PDF: ${error.message}`
        : 'Failed to print PDF: Unknown error'
    )
  }
}

/**
 * Share to social media platforms
 */
async function shareToSocial(
  pdfBlob: Blob,
  filename: string,
  options: Required<ShareOptions>
): Promise<void> {
  try {
    const url = URL.createObjectURL(pdfBlob)
    let shareUrl = ''

    switch (options.socialPlatform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(options.body)}&url=${encodeURIComponent(url)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
      default:
        throw new Error(`Unsupported social platform: ${options.socialPlatform}`)
    }

    window.open(shareUrl, '_blank')
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Failed to share to social media:', error)
    throw new Error(
      error instanceof Error 
        ? `Failed to share to social media: ${error.message}`
        : 'Failed to share to social media: Unknown error'
    )
  }
}

/**
 * Share PDF report via a custom email service
 * This can be implemented to use your own email service
 * or a third-party service like SendGrid, AWS SES, etc.
 */
export async function shareViaEmailService(
  pdfBlob: Blob,
  filename: string,
  options: EmailOptions = {}
): Promise<void> {
  const mergedOptions = { ...defaultEmailOptions, ...options }

  if (!mergedOptions.to) {
    throw new Error('Recipient email address is required')
  }

  try {
    const formData = new FormData()
    formData.append('to', mergedOptions.to)
    formData.append('subject', mergedOptions.subject)
    formData.append('body', mergedOptions.body)
    formData.append('attachment', pdfBlob, `${filename}.pdf`)

    const response = await fetch('/api/send-email', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Failed to send email:', error)
    throw new Error(
      error instanceof Error 
        ? `Failed to send email: ${error.message}`
        : 'Failed to send email: Unknown error'
    )
  }
} 