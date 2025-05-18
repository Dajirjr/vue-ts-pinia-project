declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number
    filename?: string
    image?: {
      type?: string
      quality?: number
    }
    html2canvas?: {
      scale?: number
      useCORS?: boolean
      logging?: boolean
      allowTaint?: boolean
      backgroundColor?: string
    }
    jsPDF?: {
      unit?: string
      format?: string
      orientation?: string
      compress?: boolean
    }
  }

  interface Html2PdfInstance {
    set(options: Html2PdfOptions): Html2PdfInstance
    from(element: HTMLElement): Html2PdfInstance
    save(): Promise<void>
    output(type: 'blob'): Promise<Blob>
    output(type: string): Promise<any>
  }

  function html2pdf(): Html2PdfInstance
  export = html2pdf
} 