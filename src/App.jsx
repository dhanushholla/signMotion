import React, { useState, useEffect, useRef } from 'react';
import './index.css';

const App = () => {
  const [font, setFont] = useState('Courier New');
  const [customFont, setCustomFont] = useState(null);
  const [customFontName, setCustomFontName] = useState('');
  const [text, setText] = useState('');
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [fontSize, setFontSize] = useState(40);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [animationDuration, setAnimationDuration] = useState(5);
  const [animationTiming, setAnimationTiming] = useState('linear');
  const [animationFillMode, setAnimationFillMode] = useState('forwards');
  const [animationFunction, setAnimationFunction] = useState('dash');
  const [svgContent, setSvgContent] = useState('');
  const fileInputRef = useRef(null);
  const [copyFlag, setCopyFlag] = useState(false);

  useEffect(() => {
    generateSVG();
  }, [text, strokeWidth, customFontName, strokeColor, animationDuration, animationFillMode, animationFunction, animationFillMode, animationTiming, fontSize]);

  const handleCustomFontUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomFont(e.target.result);
        setCustomFontName(file.name.split('.')[0]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const generateSVG = () => {
    const fontFace = customFont
      ? `@font-face {
          font-family: '${customFontName}';
          src: url('${customFont}');
        }`
      : '';

    const selectedFont = customFont ? customFontName : font;

    const animationStyles = {
      dash: `
        @keyframes dash {
          to { stroke-dashoffset: 0; }
        }
      `,
      strokeDashPulse: `
        @keyframes strokeDashPulse {
          0%, 100% { stroke-dashoffset: 300; }
          50% { stroke-dashoffset: 0; }
        }
      `,
      wave: `
        @keyframes wave {
          0% { stroke-dasharray: 5, 5; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 15, 5; stroke-dashoffset: 10; }
          100% { stroke-dasharray: 5, 5; stroke-dashoffset: 0; }
        }
      `,
      dashSlide: `
        @keyframes dashSlide {
          from { stroke-dashoffset: 300; }
          to { stroke-dashoffset: -300; }
        }
      `,
      dashBounce: `
        @keyframes dashBounce {
          0%, 100% { stroke-dashoffset: 300; }
          50% { stroke-dashoffset: 150; }
        }
      `,
      zigzagStroke: `
        @keyframes zigzagStroke {
          0%, 100% { stroke-dasharray: 10, 5; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 5, 10; stroke-dashoffset: 15; }
          100% { stroke-dasharray: 0, 0; stroke-dashoffset: 0; }
        }
      `,
      strokeWave: `
        @keyframes strokeWave {
          0% { stroke-dasharray: 5, 10; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 10, 5; stroke-dashoffset: 10; }
          100% { stroke-dasharray: 0, 0; stroke-dashoffset: 10; }
        }
      `,
      morph: `
        @keyframes morph {
          0% { stroke-dasharray: 10, 10; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 30, 5; stroke-dashoffset: 15; stroke: 'red'; }
          100% { stroke-dasharray: 10, 10; stroke-dashoffset: 0; }
        }
      `,
      ripple: `
        @keyframes ripple {
          0% { stroke-dasharray: 5, 10; stroke-dashoffset: 0; }
          50% { stroke-dasharray: 10, 15; stroke-dashoffset: 10; }
          100% { stroke-dasharray: 0, 0; stroke-dashoffset: 0; }
        }
      `,
      sweep: `
        @keyframes sweep {
          0% { stroke-dasharray: 10, 15; transform: scale(1.1); }
          100% { stroke-dasharray: 5, 0; transform: scale(1.0); }
        }
      `
    };

    const selectedAnimationStyle = animationStyles[animationFunction] || '';

    const svg = `
      <svg width="500" height="100">
        <style>
          ${fontFace}
          text {
            font-family: '${selectedFont}';
            font-size: ${fontSize}px;
            fill: none;
            stroke: ${strokeColor};
            stroke-width: ${strokeWidth};
            stroke-dasharray: 300;
            stroke-dashoffset: 300;
            animation: ${animationFunction} ${animationDuration}s ${animationTiming} ${animationFillMode};
          }
          ${selectedAnimationStyle}
        </style>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">
          ${text}
        </text>
      </svg>
    `;
    setSvgContent(svg);
  };

  const copySVG = () => {
    navigator.clipboard.writeText(svgContent)
      .then(() => {
        console.log('Text copied to clipboard:', svgContent);
        setCopyFlag(true)
        setTimeout(() => setCopyFlag(false), 2000)
      })
      .catch(err => {
        console.error('Failed to copy text:', err);
      });
  }
  const downloadSVG = () => {
    const blob = new Blob([svgContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'animated-text.html';
    link.click();
  };
  return (<>
    <div className=" min-h-screen bg-gray-100 p-4 lg:p-6 flex flex-col lg:flex-row gap-4">
      <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-md flex flex-col space-y-2">
        <h1 className="text-2xl font-bold text-center">🚀 SignMotion 😎</h1>

        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">Upload Custom Font:</label>
          <input
            type="file"
            accept=".otf,.ttf,.woff,.woff2"
            onChange={handleCustomFontUpload}
            ref={fileInputRef}
            className="border border-gray-300 rounded p-2"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">Enter Text:</label>
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            maxLength={25}
            className="border border-gray-300 rounded p-2"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">Stroke Width:</label>
          <input
            type="range"
            min="1"
            max="10"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">Font Size:</label>
          <input
            type="number"
            min="10"
            max="100"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">Stroke Color:</label>
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            className="border border-gray-300 rounded p-1 w-full"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">Animation Duration (seconds):</label>
          <input
            type="number"
            min="1"
            max="20"
            value={animationDuration}
            onChange={(e) => setAnimationDuration(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">Animation Timing:</label>
          <select
            value={animationTiming}
            onChange={(e) => setAnimationTiming(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
          >
            <option value="linear">Linear</option>
            <option value="ease">Ease</option>
            <option value="ease-in">Ease In</option>
            <option value="ease-out">Ease Out</option>
            <option value="ease-in-out">Ease In-Out</option>
            <option value="cubic-bezier(0.68, -0.55, 0.27, 1.55)">Bounce</option>
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">Animation Fill Mode:</label>
          <select
            value={animationFillMode}
            onChange={(e) => setAnimationFillMode(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
          >
            <option value="none">None</option>
            <option value="forwards">Forwards</option>
            <option value="backwards">Backwards</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">Select Animation Function:</label>
          <select
            value={animationFunction}
            onChange={(e) => setAnimationFunction(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
          >
            <option value="dash">Dash</option>
            <option value="strokeDashPulse">Stroke Dash Pulse</option>
            <option value="wave">Wave</option>
            <option value="dashSlide">Dash Slide</option>
            <option value="dashBounce">Dash Bounce</option>
            <option value="zigzagStroke">Zigzag Stroke</option>
            <option value="strokeWave">Stroke Wave</option>
            <option value="morph">Morph</option>
            <option value="ripple">Ripple</option>
            <option value="sweep">Sweep</option>
          </select>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center bg-white p-6 rounded-lg shadow-md h-max">
        <h2 className="text-xl font-semibold mb-4 text-center">🤩 Preview Panel 😉</h2>
        <h4 className="font-semibold mb-4 text-center">⚠️ Ensure your content fits within below display area to avoid cropping issues during download. Adjust the font size as needed for optimal results.</h4>
        <div
          className="border border-gray-300 bg-white p-4 rounded-lg shadow-md w-full flex justify-center items-center"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
        {copyFlag ? <div className='text-center'> ✨ Copied! 💫</div> : <div className='invisible'>✨ Copied! 💫</div>}
        {text ? <div className='flex gap-2 items-center justify-center w-full visible'>
          <button
            onClick={copySVG}
            className="mt-4 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Copy SVG
          </button>
          <button
            onClick={downloadSVG}
            className="mt-4 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Download as HTML
          </button>
        </div>
          : <div className='flex gap-2 items-center justify-center w-full invisible'>
            <button
              onClick={copySVG}
              className="mt-4 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Copy SVG
            </button>
            <button
              onClick={downloadSVG}
              className="mt-4 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300"
            >
              Download as HTML
            </button>
          </div>}
      </div>
    </div>
    <div className='bg-gray-100 text-center'>Made with ❤️ by Dhanush Holla</div></>
  );

};

export default App;

