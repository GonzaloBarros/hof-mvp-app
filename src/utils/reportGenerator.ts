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
  elementsToHide.forEach(el => (el as HTMLElement).style.display = 'none');

  // Lógica para esconder o slider interativo e mostrar as imagens estáticas no PDF
  const interactiveSlider = document.getElementById('interactive-slider-container');
  const staticImages = document.getElementById('static-images-for-pdf-container');

  if (interactiveSlider) interactiveSlider.style.display = 'none'; // Esconde o slider
  if (staticImages) {
    staticImages.style.display = 'flex'; // Mostra as imagens estáticas
    staticImages.style.flexDirection = 'row'; // Garante que fiquem lado a lado
    staticImages.style.justifyContent = 'space-around'; // Distribui o espaço
    staticImages.style.alignItems = 'center'; // Alinha verticalmente
  }

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
    // É necessário carregar a imagem do logo como base64 ou de uma URL que jsPDF possa acessar diretamente
    // Para simplificar, vamos usar uma imagem placeholder ou assumir que a URL é acessível
    // Em um ambiente de produção, seria melhor pré-carregar o logo como base64
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

      // Mostra novamente os elementos ocultos
      elementsToHide.forEach(el => (el as HTMLElement).style.display = '');

      // Reverte a visibilidade dos containers de imagem após a geração do PDF
      if (interactiveSlider) interactiveSlider.style.display = ''; // Volta a mostrar o slider
      if (staticImages) staticImages.style.display = 'none'; // Volta a esconder as imagens estáticas
    };
    logoImg.onerror = () => {
        console.error("Erro ao carregar o logo para o PDF.");
        // Se o logo não carregar, ainda salva o PDF sem ele
        pdf.save(`${fileName}.pdf`);
        elementsToHide.forEach(el => (el as HTMLElement).style.display = '');
        if (interactiveSlider) interactiveSlider.style.display = '';
        if (staticImages) staticImages.style.display = 'none';
    };
  });
};
