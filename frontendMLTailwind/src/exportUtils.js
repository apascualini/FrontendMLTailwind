import ExcelJS from 'exceljs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
  
    // ESTRUCTURA DE CONFIGURACIÓN: Define las columnas y el orden de exportación
  const CABECERAS = ['ID', 'Producto', 'Precio', 'Categoría'];

  const mapearDatosParaExportar = (listaProductos) => {
    return listaProductos.map(prod => [
      prod.id || '-',
      prod.nombre || '-',
      `$${Number(prod.precio || 0).toFixed(2)}`, // Fuerza 2 decimales
      prod.categoria || '-'
    ]);
  };
  
  export const exportarExcel = async (listaProductos) => {
    if (!listaProductos || listaProductos.length === 0) return alert('No hay datos para exportar');

    const filas = mapearDatosParaExportar(listaProductos);

    // 1. Crear el libro y la hoja de cálculo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Productos');

    // 2. Agregar las cabeceras y las filas
    worksheet.addRow(CABECERAS);
    worksheet.addRows(filas);

    // Estilo opcional moderno: Poner la primera fila en negrita
    worksheet.getRow(1).font = { bold: true };

    // 3. Generar el archivo binario y forzar la descarga en el navegador
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte_productos_${new Date().toISOString().slice(0,10)}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  export const exportarCSV = (listaProductos) => {
    if (!listaProductos || listaProductos.length === 0) return alert('No hay datos para exportar');

    const filas = mapearDatosParaExportar(listaProductos);
    
    // Unimos las cabeceras y las filas con saltos de línea
    const contenidoCsv = [
      CABECERAS.join(','),
      ...filas.map(fila => fila.map(celda => `"${celda}"`).join(',')) // Envuelve en comillas por si hay comas en el texto
    ].join('\n');

    // Crear archivo temporal en el navegador y forzar descarga
    const blob = new Blob([contenidoCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_productos_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  export const exportarPDF = (listaProductos) => {
    if (!listaProductos || listaProductos.length === 0) return alert('No hay datos para exportar');

    const doc = new jsPDF();
    const filas = mapearDatosParaExportar(listaProductos);

    // Título e información del reporte en el documento
    doc.setFontSize(18);
    doc.text('Reporte de Inventario de Productos', 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 14, 30);

    // Generación automática de la tabla con estilos limpios
    autoTable(doc, {
        startY: 35,
        head: [CABECERAS],
        body: filas,
        theme: 'striped',
        headStyles: { fillColor: [30, 41, 59] }, // Color slate-800
        styles: { fontSize: 9, cellPadding: 3 }
    });

    // Descargar el archivo PDF
    doc.save(`reporte_productos_${new Date().toISOString().slice(0,10)}.pdf`);
  };