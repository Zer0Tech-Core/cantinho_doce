// scripts/convert-images.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = './public/imagens/produtos';
const outputDir = './public/imagens/produtos-webp';

// Cria a pasta de saída se não existir
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Lê todos os arquivos PNG
const files = fs.readdirSync(inputDir);

files.forEach(file => {
  if (file.endsWith('.png')) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, file.replace('.png', '.webp'));
    
    sharp(inputPath)
      .webp({ 
        quality: 80, // 80% de qualidade (bom equilíbrio)
        effort: 4    // Esforço de compressão (1-6)
      })
      .toFile(outputPath)
      .then(() => {
        const originalSize = fs.statSync(inputPath).size / 1024;
        const newSize = fs.statSync(outputPath).size / 1024;
        console.log(`✅ ${file}: ${originalSize.toFixed(1)}KB → ${newSize.toFixed(1)}KB (${((1 - newSize/originalSize) * 100).toFixed(0)}% menor)`);
      })
      .catch(err => {
        console.error(`❌ Erro ao converter ${file}:`, err);
      });
  }
});