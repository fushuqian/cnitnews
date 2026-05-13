/**
 * CN Geeker Pixel Logo Generator
 * Generates 8-bit pixel style logo with transparent background
 * "CN" in white, "GEEKER" in black
 * 
 * Usage: node generate_logo.js
 */

const fs = require('fs');
const path = require('path');

// Simple PNG generator (no dependencies)
// Creates a minimal 8-bit pixel art logo

function createPixelLogo(outputPath) {
  // Each "pixel" block = 20x20 real pixels
  const PIXEL = 20;
  
  // Font definition for 8-bit style characters
  // Using simple pixel font (5x7 grid per char + 1px spacing)
  const font = {
    'C': [
      '01110',
      '10001',
      '10000',
      '10000',
      '10000',
      '10001',
      '01110',
    ],
    'N': [
      '10001',
      '11001',
      '10101',
      '10011',
      '10001',
      '10001',
      '10001',
    ],
    'G': [
      '01110',
      '10001',
      '10000',
      '10111',
      '10001',
      '10001',
      '01110',
    ],
    'E': [
      '11111',
      '10000',
      '10000',
      '11110',
      '10000',
      '10000',
      '11111',
    ],
    'K': [
      '10001',
      '10010',
      '10100',
      '11000',
      '10100',
      '10010',
      '10001',
    ],
    'R': [
      '11110',
      '10001',
      '10001',
      '11110',
      '10100',
      '10010',
      '10001',
    ],
  };

  const charWidth = 5;  // 5 pixels wide
  const charHeight = 7; // 7 pixels tall
  const spacing = 1;    // 1 pixel spacing between chars
  const gapBetweenWords = 2; // 2 pixels gap between CN and GEEKER

  // Two rows: "CN" in white (top), "GEEKER" in black (bottom)
  const rows = [
    { chars: 'CN', color: [255, 255, 255, 255] },
    { chars: 'GEEKER', color: [30, 30, 30, 255] },
  ];

  // Calculate dimensions (use longest row for width)
  let maxWidth = 0;
  for (const row of rows) {
    const w = row.chars.length * (charWidth + spacing) - spacing;
    if (w > maxWidth) maxWidth = w;
  }

  const pixelWidth = maxWidth;
  const pixelHeight = rows.length * (charHeight + spacing * 2) + 2;

  // Real image dimensions
  const padding = 30;
  const imgWidth = pixelWidth * PIXEL + padding * 2;
  const imgHeight = pixelHeight * PIXEL + padding * 2;

  // Create raw pixel data (RGBA)
  const pixels = Buffer.alloc(imgWidth * imgHeight * 4, 0); // Start with transparent

  function setPixel(x, y, r, g, b, a) {
    const idx = (y * imgWidth + x) * 4;
    pixels[idx] = r;
    pixels[idx + 1] = g;
    pixels[idx + 2] = b;
    pixels[idx + 3] = a;
  }

  // Draw the pixel art (two rows)
  const startY = padding / PIXEL + 1;
  const rowGap = 2; // pixel gap between rows

  for (let ri = 0; ri < rows.length; ri++) {
    const row = rows[ri];
    const rowWidth = row.chars.length * (charWidth + spacing) - spacing;
    // Center the row horizontally
    let currentX = (padding / PIXEL) + Math.floor((pixelWidth - rowWidth) / 2);
    const rowY = startY + ri * (charHeight + rowGap);
    
    for (let ci = 0; ci < row.chars.length; ci++) {
      const charData = font[row.chars[ci]];
      if (!charData) continue;
      
      for (let r = 0; r < charHeight; r++) {
        for (let c = 0; c < charWidth; c++) {
          if (charData[r][c] === '1') {
            const px = (currentX + c) * PIXEL + padding;
            const py = (rowY + r) * PIXEL + padding;
            for (let dy = 0; dy < PIXEL; dy++) {
              for (let dx = 0; dx < PIXEL; dx++) {
                const realX = px + dx;
                const realY = py + dy;
                if (realX < imgWidth && realY < imgHeight) {
                  setPixel(realX, realY, row.color[0], row.color[1], row.color[2], row.color[3]);
                }
              }
            }
          }
        }
      }
      currentX += charWidth + spacing;
    }
  }

  // Write PNG file manually (minimal PNG encoder)
  writePNG(imgWidth, imgHeight, pixels, outputPath);
  console.log(`Logo saved: ${outputPath} (${imgWidth}x${imgHeight})`);
}

// Minimal PNG encoder
function writePNG(width, height, pixelData, filePath) {
  // PNG signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // IDAT chunk (raw pixel data with filter bytes)
  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0); // filter: none
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      rawData.push(pixelData[idx]);
      rawData.push(pixelData[idx + 1]);
      rawData.push(pixelData[idx + 2]);
      rawData.push(pixelData[idx + 3]);
    }
  }

  // Use zlib from Node.js
  const zlib = require('zlib');
  const compressed = zlib.deflateSync(Buffer.from(rawData));

  // Write all chunks
  const chunks = [];
  
  // IHDR
  chunks.push(sig);
  chunks.push(createChunk('IHDR', ihdr));
  
  // gAMA chunk (gamma)
  const gama = Buffer.alloc(4);
  gama.writeUInt32BE(100000); // 1.0
  chunks.push(createChunk('gAMA', gama));
  
  // IDAT
  chunks.push(createChunk('IDAT', compressed));
  
  // IEND
  chunks.push(createChunk('IEND', Buffer.alloc(0)));

  fs.writeFileSync(filePath, Buffer.concat(chunks));
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeB = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeB, data]);
  const crc = crc32(crcData);
  const crcB = Buffer.alloc(4);
  crcB.writeUInt32BE(crc >>> 0);
  return Buffer.concat([len, typeB, data, crcB]);
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

// Generate the logo
createPixelLogo('C:\\Users\\fushu\\OneDrive\\Desktop\\cngeeker_logo_final.png');
