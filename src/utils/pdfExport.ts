import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function exportMemoriesToPdf(elementId: string = "exportable-content") {
  const element = document.getElementById(elementId) || document.body;
  
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Happy_Girlfriend_Day_Memories.pdf");
    return true;
  } catch (err) {
    console.error("Failed to export PDF", err);
    return false;
  }
}
