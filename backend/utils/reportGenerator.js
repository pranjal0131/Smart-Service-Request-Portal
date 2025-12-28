const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

function generateServiceRequestsReport(requests, reportsPath) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const filename = `service-requests-report-${Date.now()}.pdf`;
      const filepath = path.join(reportsPath, filename);
      const stream = fs.createWriteStream(filepath);

      doc.pipe(stream);

      // Title
      doc.fontSize(20).font('Helvetica-Bold').text('Service Requests Report', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica').text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.moveDown(1);

      // Summary Stats
      const stats = {
        total: requests.length,
        open: requests.filter(r => r.status === 'Open').length,
        inProgress: requests.filter(r => r.status === 'In Progress').length,
        resolved: requests.filter(r => r.status === 'Resolved').length,
      };

      doc.fontSize(14).font('Helvetica-Bold').text('Summary Statistics', { underline: true });
      doc.fontSize(11).font('Helvetica');
      doc.text(`Total Requests: ${stats.total}`);
      doc.text(`Open: ${stats.open}`);
      doc.text(`In Progress: ${stats.inProgress}`);
      doc.text(`Resolved: ${stats.resolved}`);
      doc.moveDown(1);

      // Requests Table Header
      doc.fontSize(12).font('Helvetica-Bold').text('Service Requests Details', { underline: true });
      doc.moveDown(0.5);

      // Table data
      const tableTop = doc.y;
      const col1 = 50;
      const col2 = 150;
      const col3 = 280;
      const col4 = 400;
      const col5 = 500;
      const rowHeight = 15;

      // Header row
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text('Title', col1, tableTop);
      doc.text('Category', col2, tableTop);
      doc.text('Status', col3, tableTop);
      doc.text('Priority', col4, tableTop);
      doc.text('Date', col5, tableTop);

      doc.moveTo(col1, tableTop + rowHeight)
        .lineTo(550, tableTop + rowHeight)
        .stroke();

      // Data rows
      let currentY = tableTop + rowHeight + 5;
      doc.fontSize(9).font('Helvetica');

      requests.forEach((request, index) => {
        if (currentY > 700) {
          doc.addPage();
          currentY = 50;
        }

        const title = request.title.substring(0, 20);
        const createdDate = new Date(request.createdAt).toLocaleDateString();

        doc.text(title, col1, currentY);
        doc.text(request.category, col2, currentY);
        doc.text(request.status, col3, currentY);
        doc.text(request.priority, col4, currentY);
        doc.text(createdDate, col5, currentY);

        currentY += rowHeight;
      });

      // Footer
      doc.fontSize(10).font('Helvetica').text('End of Report', { align: 'center', y: 750 });

      doc.end();

      stream.on('finish', () => {
        resolve({ filename, filepath });
      });

      stream.on('error', (err) => {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generateServiceRequestsReport };
