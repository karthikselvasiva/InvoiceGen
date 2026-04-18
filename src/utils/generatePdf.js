export const generateInvoicePdf = async (element, filename = 'invoice.pdf') => {
  try {
    const html2pdf = (await import('html2pdf.js')).default;
    const opt = {
      margin:       0,
      filename:     filename,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false, scrollY: 0 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak:    { mode: 'avoid-all' }
    };

    html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error("PDF generation failed", error);
    alert("Could not generate PDF on this device.");
  }
};
