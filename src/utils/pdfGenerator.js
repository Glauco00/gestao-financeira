import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Gera um relatório PDF magnífico das transações financeiras.
 * @param {Object} data - Objeto contendo { transactions, summary, period, userName }
 */
export const generateFinancePDF = ({ transactions, summary, period, userName }) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [16, 185, 129]; // #10b981 (Accent)
  const dangerColor = [239, 68, 68]; // #ef4444
  const darkColor = [24, 24, 27]; // #18181b
  const mutedColor = [161, 161, 170]; // #a1a1aa

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  // --- HEADER ---
  // Background do cabeçalho
  doc.setFillColor(...darkColor);
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Logo / Título
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('GESTA', margin, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Gestão Financeira Inteligente', margin, 26);

  // Info Relatório
  doc.setFontSize(10);
  doc.text(`Usuário: ${userName || 'Usuário'}`, pageWidth - margin, 20, { align: 'right' });
  doc.text(`Período: ${period || 'Todo o Período'}`, pageWidth - margin, 26, { align: 'right' });
  doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, pageWidth - margin, 32, { align: 'right' });

  // --- SUMMARY CARDS ---
  let yPos = 55;
  const cardWidth = (pageWidth - (margin * 2) - 10) / 3;

  // Card: Receitas
  doc.setDrawColor(...mutedColor);
  doc.setLineWidth(0.1);
  doc.roundedRect(margin, yPos, cardWidth, 25, 3, 3);
  doc.setFontSize(9);
  doc.setTextColor(...mutedColor);
  doc.text('RECEITAS TOTAL', margin + 5, yPos + 8);
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text(`+ R$ ${summary.income.toFixed(2)}`, margin + 5, yPos + 18);

  // Card: Despesas
  doc.roundedRect(margin + cardWidth + 5, yPos, cardWidth, 25, 3, 3);
  doc.setFontSize(9);
  doc.setTextColor(...mutedColor);
  doc.text('DESPESAS TOTAL', margin + cardWidth + 10, yPos + 8);
  doc.setFontSize(14);
  doc.setTextColor(...dangerColor);
  doc.text(`- R$ ${summary.expense.toFixed(2)}`, margin + cardWidth + 10, yPos + 18);

  // Card: Balanço
  doc.setFillColor(...darkColor);
  doc.roundedRect(margin + (cardWidth * 2) + 10, yPos, cardWidth, 25, 3, 3, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('BALANÇO LÍQUIDO', margin + (cardWidth * 2) + 15, yPos + 8);
  doc.setFontSize(14);
  doc.setTextColor(...(summary.balance >= 0 ? primaryColor : dangerColor));
  doc.text(`R$ ${summary.balance.toFixed(2)}`, margin + (cardWidth * 2) + 15, yPos + 18);

  // --- TRANSACTIONS TABLE ---
  yPos += 45;
  doc.setTextColor(...darkColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Detalhamento de Transações', margin, yPos);

  const tableRows = transactions.map(t => [
    new Date(t.date).toLocaleDateString(),
    t.description || 'N/A',
    t.category_name || '—',
    t.type === 'income' ? 'Receita' : 'Despesa',
    { 
      content: `R$ ${t.amount.toFixed(2)}`, 
      styles: { textColor: t.type === 'income' ? primaryColor : dangerColor, fontStyle: 'bold' } 
    }
  ]);

  doc.autoTable({
    startY: yPos + 5,
    margin: { left: margin, right: margin },
    head: [['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']],
    body: tableRows,
    theme: 'striped',
    headStyles: {
      fillColor: darkColor,
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center'
    },
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 25, halign: 'center' },
      4: { cellWidth: 35, halign: 'right' }
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    }
  });

  // --- FOOTER ---
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...mutedColor);
    doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    doc.text('Documento gerado automaticamente pelo Sistema Gesta Financeira.', margin, doc.internal.pageSize.getHeight() - 10);
  }

  doc.save(`Relatorio_Financeiro_${new Date().toISOString().slice(0,10)}.pdf`);
};
