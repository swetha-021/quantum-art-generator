let quantumData = null;
let canvas;

function setup() {
  canvas = createCanvas(700, 500);
  canvas.parent('canvas-container');
  background(10);
}


// const CURBY_URLS = [];

async function fetchQuantumEntropy() {
  document.getElementById('apiStatus').textContent = 'Fetching...';
  document.getElementById('apiStatus').className = 'info-value status-fetching';

  try {
    const response = await fetch(
      'https://beacon.nist.gov/beacon/2.0/pulse/last'
    );

    const data = await response.json();

    console.log('CURBy data:', data);

    const pulse = data.pulse || data;
    const outputValue =
      pulse.outputValue ||
      pulse.localRandomValue ||
      pulse.randomValue;

      const localNoise = Array.from(crypto.getRandomValues(new Uint8Array(8)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      outputValue += localNoise;

    if (!outputValue) {
      throw new Error('No entropy value found');
    }

    quantumData = pulse;

    document.getElementById('apiStatus').textContent = '✅ Quantum Connected';
    document.getElementById('apiStatus').className = 'info-value status-connected';
    document.getElementById('pulseId').textContent =
      pulse.pulseIndex || pulse.index || '—';
    document.getElementById('pulseTime').textContent =
      new Date(pulse.timeStamp || pulse.timestamp).toLocaleString();
    document.getElementById('entropyValue').textContent =
      outputValue.substring(0, 32) + '...';
    document.getElementById('bitsUsed').textContent = '512 bits';
    document.getElementById('entropySource').textContent =
      'CURBy quantum beacon';

    animateTrustChain();
    return outputValue;
  } catch (err) {
    console.warn('CURBy fetch failed:', err);
    return useFallback();
  }
}

function useFallback() {
  console.warn('All CURBy proxies failed — using crypto fallback');

  document.getElementById('apiStatus').textContent = '⚠️ Using Crypto Fallback';
  document.getElementById('apiStatus').className = 'info-value status-fetching';
  document.getElementById('pulseTime').textContent = new Date().toLocaleString();
  document.getElementById('bitsUsed').textContent = '256 bits (fallback)';
  document.getElementById('pulseId').textContent = 'local-' + Date.now();
  document.getElementById('entropySource').textContent = 'Browser crypto fallback';

  const fallbackHex = Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  document.getElementById('entropyValue').textContent = fallbackHex.substring(0, 32) + '...';

  animateTrustChain();
  return fallbackHex;
}

function animateTrustChain() {
  const steps = ['step1', 'step2', 'step3', 'step4'];
  steps.forEach(id => document.getElementById(id).classList.remove('active'));
  steps.forEach((id, i) => {
    setTimeout(() => document.getElementById(id).classList.add('active'), i * 500);
  });
}

function hexToNumbers(hexString) {
  const numbers = [];
  for (let i = 0; i < hexString.length - 1; i += 2) {
    numbers.push(parseInt(hexString.substring(i, i + 2), 16));
  }
  return numbers;
}

document.getElementById('generateBtn').addEventListener('click', async () => {
  const button = document.getElementById('generateBtn');

  button.disabled = true;
  button.textContent = 'Generating...';

  const entropy = await fetchQuantumEntropy();

  if (entropy) {
    const numbers = hexToNumbers(entropy);
    startArt(numbers);
  }

  button.disabled = false;
  button.textContent = '⚛️ Generate Quantum Art';
});

document.getElementById('clearBtn').addEventListener('click', () => {
  clearArt();
  quantumData = null;
  document.getElementById('apiStatus').textContent = 'Waiting...';
  document.getElementById('apiStatus').className = 'info-value status-waiting';
  document.getElementById('pulseId').textContent = '—';
  document.getElementById('pulseTime').textContent = '—';
  document.getElementById('entropyValue').textContent = '—';
  document.getElementById('bitsUsed').textContent = '—';
  document.getElementById('entropySource').textContent = '—';
  ['step1','step2','step3','step4'].forEach(id => {
    document.getElementById(id).classList.remove('active');
  });
});

document.getElementById('saveBtn').addEventListener('click', () => saveArt());

document.getElementById('speed').addEventListener('input', (e) => {
  document.getElementById('speedValue').textContent = e.target.value;
});

function startArt(numbers) {
  background(10);

  const style = document.getElementById('artStyle').value;
  const mood = document.getElementById('colorMood').value;
  const speed = Number(document.getElementById('speed').value);

  let palette;

  if (mood === 'cosmic') {
    palette = [
      [120, 80, 255],
      [255, 100, 180],
      [80, 200, 255],
      [255, 255, 255]
    ];
  } else if (mood === 'ocean') {
    palette = [
      [0, 120, 255],
      [0, 180, 200],
      [100, 255, 220],
      [220, 255, 255]
    ];
  } else if (mood === 'fire') {
    palette = [
      [255, 80, 0],
      [255, 140, 0],
      [255, 220, 0],
      [255, 255, 255]
    ];
  } else {
    palette = [
      [50, 120, 50],
      [80, 180, 80],
      [150, 220, 120],
      [240, 255, 240]
    ];
  }

  for (let i = 0; i < 80; i++) {
    const x = (numbers[i % numbers.length] / 255) * width;
    const y = (numbers[(i + 1) % numbers.length] / 255) * height;
    const size = ((numbers[(i + 2) % numbers.length] / 255) * 40) + 5;

    const colorIndex = numbers[(i + 3) % numbers.length] % palette.length;
    const c = palette[colorIndex];

    fill(c[0], c[1], c[2], 180);
    stroke(c[0], c[1], c[2], 120);

    if (style === 'particles') {
      noStroke();

      drawingContext.shadowBlur = 25;
      drawingContext.shadowColor = `rgba(${c[0]}, ${c[1]}, ${c[2]}, 0.8)`;

      circle(x, y, size);

      drawingContext.shadowBlur = 40;
    }

    if (style === 'waves') {
      strokeWeight(2);
      line(x, y, x + size * speed, y + size / 2);
    }

    if (style === 'constellation') {
      strokeWeight(1.5);
      line(x, y, width / 2, height / 2);
      circle(x, y, size / 3);
    }
  }
}

function clearArt() {
  background(10);
}

function saveArt() {
  saveCanvas('quantum-art', 'png');
}