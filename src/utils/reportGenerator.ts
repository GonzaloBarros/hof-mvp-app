import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePdf = (elementId: string, fileName: string, doctorName: string, logoUrl: string) => {
  const input = document.getElementById(elementId);

  if (!input) {
    console.error(`Elemento com id '${elementId}' não encontrado.`);
    return;
  }

  // Oculta botões e elementos que não queremos no PDF
  const elementsToHide = input.querySelectorAll('.no-print');
  elementsToHide.forEach(el => el.classList.add('pdf-hidden')); // Adiciona classe para esconder

  // Lógica para esconder o slider interativo e mostrar as imagens estáticas no PDF
  const interactiveSlider = document.getElementById('interactive-slider-container');
  const staticImages = document.getElementById('static-images-for-pdf-container');

  if (interactiveSlider) interactiveSlider.classList.add('pdf-hidden'); // Esconde o slider
  if (staticImages) staticImages.classList.add('pdf-flex'); // Mostra as imagens estáticas

  // Adiciona um pequeno atraso para garantir que o navegador aplique as classes antes de capturar
  setTimeout(() => {
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

      // Adiciona a imagem capturada do HTML ao PDF
      pdf.addImage(imgData, 'PNG', 0, 0, width, finalHeight);

      // Adiciona o logo no canto superior esquerdo
      const logoImg = new Image();
      logoImg.src = logoUrl;
      logoImg.onload = () => {
        // Adiciona o logo (ajuste as coordenadas e o tamanho conforme necessário)
        pdf.addImage(logoImg, 'PNG', 10, 10, 30, 8); // x, y, width, height em mm

        // Adiciona o nome do doutor no canto superior direito
        pdf.setFontSize(10);
        pdf.text(`Dr. ${doctorName}`, pdfWidth - 10, 15, { align: 'right' }); // x, y, alinhamento

        // Adiciona o rodapé centralizado na parte inferior
        pdf.setFontSize(10);
        pdf.text("Reporte gerado por sistema Medanalitic", pdfWidth / 2, pdfHeight - 10, { align: 'center' });

        pdf.save(`${fileName}.pdf`);

        // Reverte as classes de visibilidade após a geração do PDF
        elementsToHide.forEach(el => el.classList.remove('pdf-hidden'));
        if (interactiveSlider) interactiveSlider.classList.remove('pdf-hidden');
        if (staticImages) staticImages.classList.remove('pdf-flex');
      };
      logoImg.onerror = () => {
          console.error("Erro ao carregar o logo para o PDF.");
          // Se o logo não carregar, ainda salva o PDF sem ele
          pdf.save(`${fileName}.pdf`);
          elementsToHide.forEach(el => el.classList.remove('pdf-hidden'));
          if (interactiveSlider) interactiveSlider.classList.remove('pdf-hidden');
          if (staticImages) staticImages.classList.remove('pdf-flex');
      };
    });
  }, 100); // Atraso de 100ms
};
