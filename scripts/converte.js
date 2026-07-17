// convert-imagem.js
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

//  MUDE AQUI O CAMINHO
const inputFile = './public/sobre/Flork.png';

// Verifica se o arquivo existe
if (!fs.existsSync(inputFile)) {
  console.error(`❌ Arquivo não encontrado: ${inputFile}`);
  console.log('📁 Verifique se o caminho está correto.');
  console.log('📁 Caminho atual:', path.resolve(inputFile));
  process.exit(1);
}

const outputFile = inputFile.replace(/\.(png|jpg|jpeg)$/i, '.webp');

console.log(`🔄 Convertendo: ${inputFile}`);
console.log(`📁 Para: ${outputFile}`);

sharp(inputFile)
  .webp({ quality: 80 })
  .toFile(outputFile)
  .then(() => {
    const originalSize = fs.statSync(inputFile).size / 1024;
    const newSize = fs.statSync(outputFile).size / 1024;
    const reduction = ((1 - newSize / originalSize) * 100).toFixed(0);
    
    console.log(`✅ Convertido com sucesso!`);
    console.log(`${originalSize.toFixed(1)}KB → ${newSize.toFixed(1)}KB (${reduction}% menor)`);
  })
  .catch(err => {
    console.error('❌ Erro:', err.message);
  });