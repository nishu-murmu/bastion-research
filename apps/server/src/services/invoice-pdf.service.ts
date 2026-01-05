import axios from "axios";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export type InvoicePdfData = {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  billToName: string;
  billToAddress: string;
  shipToName: string;
  shipToAddress: string;
  itemDescription: string;
  quantity: number;
  amount: number;
  total: number;
  balanceDue: number;
};

export async function generateInvoicePdf(
  templateUrl: string,
  data: InvoicePdfData
): Promise<Uint8Array> {
  const response = await axios.get<ArrayBuffer>(templateUrl, {
    responseType: "arraybuffer",
  });
  const existingPdfBytes = new Uint8Array(response.data as ArrayBuffer);

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 10;

  const drawText = (
    text: string,
    x: number,
    y: number,
    size: number = fontSize
  ) => {
    if (!text) return;
    firstPage.drawText(text, {
      x,
      y,
      size,
      font,
      color: rgb(0, 0, 0),
    });
  };

  const drawMultiline = (
    text: string,
    x: number,
    startY: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = (text || "").split(/\s+/).filter(Boolean);
    let line = "";
    let y = startY;

    const flush = (value: string) => {
      if (!value) return;
      firstPage.drawText(value, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      y -= lineHeight;
    };

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, fontSize);
      if (width > maxWidth) {
        flush(line);
        line = word;
      } else {
        line = testLine;
      }
    }
    flush(line);
  };

  const pageHeight = firstPage.getHeight();

  const headerY = pageHeight - 120;
  const datesY = pageHeight - 160;
  const billToY = pageHeight - 230;
  const shipToY = pageHeight - 230;
  const itemsRowY = pageHeight - 360;
  const totalsBoxY = pageHeight - 430;

  drawText(data.invoiceNumber, 120, headerY);
  drawText(data.invoiceDate, 120, datesY);
  drawText(data.dueDate, 120, datesY - 18);

  const billToBlock = [data.billToName, data.billToAddress]
    .filter(Boolean)
    .join("\n");
  drawMultiline(billToBlock, 40, billToY, 220, 12);

  const shipToBlock = [data.shipToName, data.shipToAddress]
    .filter(Boolean)
    .join("\n");
  drawMultiline(shipToBlock, 320, shipToY, 220, 12);

  drawText("1", 40, itemsRowY);
  drawMultiline(data.itemDescription, 70, itemsRowY, 260, 12);
  drawText(String(data.quantity || 1), 360, itemsRowY);
  drawText(data.amount.toFixed(2), 410, itemsRowY);
  drawText(data.amount.toFixed(2), 520, itemsRowY);

  drawText(data.total.toFixed(2), 520, totalsBoxY);
  drawText(data.balanceDue.toFixed(2), 520, totalsBoxY - 30);

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

