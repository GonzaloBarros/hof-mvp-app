import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePdf = (elementId: string, fileName: string) => {
    const input = document.getElementById(elementId);

    if (!input) {
        console.error(`Elemento com id '${elementId}' não encontrado.`);
        return;
    }

    // Oculta botões e elementos que não queremos no PDF
    const elementsToHide = input.querySelectorAll('.no-print');
    elementsToHide.forEach(el => (el as HTMLElement).style.display = 'none');

    html2canvas(input, {
        scale: 2, // Aumenta a escala para melhor qualidade de imagem
        useCORS: true,
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' = portrait, 'mm' = milímetros, 'a4' = tamanho da página
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        const width = pdfWidth;
        const height = width / ratio;

        // Se a altura for maior que a página, ajustamos
        let finalHeight = height > pdfHeight ? pdfHeight : height;

        pdf.addImage(imgData, 'PNG', 0, 0, width, finalHeight);
        pdf.save(`${fileName}.pdf`);

        // Mostra novamente os elementos ocultos
        elementsToHide.forEach(el => (el as HTMLElement).style.display = '');
    });
};
