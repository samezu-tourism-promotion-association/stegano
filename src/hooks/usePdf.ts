import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { useRef } from 'react'

export const usePdf = () => {
  const targetRef = useRef<HTMLDivElement>(null)

  const pdfOpenHandler = () => {
    if (targetRef.current === null) return

    html2canvas(targetRef.current).then((canvas) => {
      const pdf = new jsPDF({ format: 'a4' })
      pdf.addImage(canvas, 'canvas', 15, 10, canvas.width / 18, canvas.height / 18)
      window.open(pdf.output('bloburl'))
    })
  }

  return {
    targetRef,
    pdfOpenHandler,
  }
}

