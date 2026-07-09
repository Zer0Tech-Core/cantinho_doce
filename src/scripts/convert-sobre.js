// convert-sobre.js
const sharp = require('sharp');
const fs = require('fs');

const arquivos = [
  './public/imagens/sobre/Flork.png',
  // Adicione outros aqui se quiser
];

async function converter() {
  for (const input of arquivos) {
    if (!fs.existsSync(input)) {
      console.log(`❌ Arquivo não encontrado: ${input}`);
      continue;
    }
    
    const output = input.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    
    try {
      await sharp(input)
        .webp({ quality: 80, effort: 6 })
        .toFile(output);
      
      const originalSize = fs.statSync(input).size / 1024;
      const newSize = fs.statSync(output).size / 1024;
      const reduction = ((1 - newSize / originalSize) * 100).toFixed(0);
      
      console.log(`✅ ${input.split('/').pop()} → ${reduction}% menor`);
    } catch (err) {
      console.error(`❌ Erro em ${input}:`, err.message);
    }
  }
}

converter();