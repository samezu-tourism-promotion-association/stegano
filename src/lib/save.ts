import { toPng } from "html-to-image";
import jsPDF from "jspdf";

const saveLetterImage = async () => {
  const letter = document.getElementById("letter");
  if (letter) {
    const dataUrl = await toPng(letter, {
      width: 590.5,
      height: 874,
      style: {
        transform: "scale(1.845)",
        transformOrigin: "top left",
      },
    });
    const link = document.createElement("a");
    link.download = "letter.png";
    link.href = dataUrl;
    link.click();
  }
};

const saveLetterPdf = async () => {
  try {
    const letter = document.getElementById("letter");
    if (letter) {
      const dataUrl = await toPng(letter, {
        width: 590.5,
        height: 874,
        style: {
          transform: "scale(1.845)",
          transformOrigin: "top left",
        },
      });
      const pdf = new jsPDF("p", "mm", [148, 100]);
      pdf.addImage(dataUrl, "PNG", 0, 0, 100, 148);
      pdf.save("letter.pdf");
    }
  } catch (error) {
    console.error(error);
  }
};

export { saveLetterImage, saveLetterPdf };
