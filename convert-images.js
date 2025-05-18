import fs from 'fs/promises';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = {
    'logo-dark': [512, 128, 64],
    'logo-light': [512, 128, 64],
    'icon-only': [512, 128, 64],
    'qr-code': [300]
};

async function convertSvgToPng(svgPath, outputPath, size) {
    try {
        const svgBuffer = await fs.readFile(svgPath);
        await sharp(svgBuffer)
            .resize(size, size)
            .png()
            .toFile(outputPath);
        console.log(`Converted ${svgPath} to ${outputPath}`);
    } catch (error) {
        console.error(`Error converting ${svgPath}:`, error);
    }
}

async function main() {
    // Convert logos
    for (const [name, sizeList] of Object.entries(sizes)) {
        for (const size of sizeList) {
            const svgPath = join(__dirname, 'public', 'launch-assets', 'logos', `${name}.svg`);
            const outputPath = join(__dirname, 'public', 'launch-assets', 'logos', `${name}-${size}.png`);
            await convertSvgToPng(svgPath, outputPath, size);
        }
    }

    // Convert QR code
    const qrSvgPath = join(__dirname, 'public', 'launch-assets', 'social', 'qr-code.svg');
    const qrPngPath = join(__dirname, 'public', 'launch-assets', 'social', 'qr-code.png');
    await convertSvgToPng(qrSvgPath, qrPngPath, 300);
}

main().catch(console.error); 