import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// A função agora aceita o nome do doutor e o caminho do logo como parâmetros opcionais
export const generatePdf = (elementId: string, fileName: string, doctorName?: string, logoUrl?: string) => {
    const input = document.getElementById(elementId);

    if (!input) {
        console.error(`Elemento com id '${elementId}' não encontrado.`);
        return;
    }

    const elementsToHide = input.querySelectorAll('.no-print');
    elementsToHide.forEach(el => (el as HTMLElement).style.display = 'none');

    html2canvas(input, {
        scale: 2,
        useCORS: true,
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Adicionar o cabeçalho com o logo e o nome do doutor
        if (logoUrl) {
            // Assumindo que o logo tem uma proporção de 3:1 (largura:altura)
            const logoWidth = 30;
            const logoHeight = 10;
            pdf.addImage(logoUrl, 'PNG', 15, 10, logoWidth, logoHeight);
        }
        if (doctorName) {
            pdf.setFontSize(10);
            pdf.text(`Relatório gerado por: ${doctorName}`, pdfWidth - 15, 15, { align: 'right' });
        }
        pdf.line(15, 25, pdfWidth - 15, 25); // Linha separadora

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        
        let width = pdfWidth - 30; // Margens de 15mm de cada lado
        let height = width / ratio;

        // Deixa um espaço para o cabeçalho
        const contentStartY = 35; 
        const availableHeight = pdfHeight - contentStartY - 15;

        if (height > availableHeight) {
            height = availableHeight;
            width = height * ratio;
        }
        
        const xOffset = (pdfWidth - width) / 2;

        pdf.addImage(imgData, 'PNG', xOffset, contentStartY, width, height);
        pdf.save(`${fileName}.pdf`);

        elementsToHide.forEach(el => (el as HTMLElement).style.display = '');
    });
};
