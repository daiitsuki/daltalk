import React, { useState, useEffect, useRef } from 'react';
import { TbAlphabetKorean } from 'react-icons/tb';

const FontSwitcher = () => {
  const fontDisplayNames = {
    'sans-serif': '기본값',
    Paperlogy: '고딕체',
    Ownglyph_ParkDaHyun: '온글잎체',
    omyu_pretty: '오뮤다예쁨체',
    HakgyoansimGeurimilgiTTF: '그림일기체',
  };
  const fonts = Object.keys(fontDisplayNames);
  const [currentFont, setCurrentFont] = useState(
    localStorage.getItem('font') || 'sans-serif',
  );

  const fontSizes = {
    '13px': '작게',
    '15px': '보통',
    '17px': '크게',
  };
  const sizes = Object.keys(fontSizes);
  const [currentSize, setCurrentSize] = useState(
    localStorage.getItem('fontSize') || '15px',
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.body.style.fontFamily = currentFont;
    localStorage.setItem('font', currentFont);
  }, [currentFont]);

  useEffect(() => {
    document.body.style.fontSize = currentSize;
    localStorage.setItem('fontSize', currentSize);
  }, [currentSize]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFontChange = (font) => {
    setCurrentFont(font);
    setIsDropdownOpen(false);
  };

  const handleSizeChange = (size) => {
    setCurrentSize(size);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        title="폰트 및 크기 변경"
        className="flex cursor-pointer items-center justify-center rounded border-none bg-transparent px-4 py-2 text-sm text-white"
      >
        <TbAlphabetKorean className="hover:scale-105" size={24} />
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg">
          <div className="py-1">
            <div className="px-4 py-2 text-xs font-bold uppercase text-gray-500">
              글꼴
            </div>
            <ul>
              {fonts.map((font) => (
                <li
                  key={font}
                  onClick={() => handleFontChange(font)}
                  className={`cursor-pointer px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 ${
                    currentFont === font ? 'bg-gray-100 font-bold' : ''
                  }`}
                  style={{ fontFamily: font }}
                >
                  {fontDisplayNames[font]}
                </li>
              ))}
            </ul>
            <div className="my-1 border-t border-gray-200"></div>
            <div className="px-4 py-2 text-xs font-bold uppercase text-gray-500">
              글자 크기
            </div>
            <ul>
              {sizes.map((size) => (
                <li
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={`cursor-pointer px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 ${
                    currentSize === size ? 'bg-gray-100 font-bold' : ''
                  }`}
                  style={{ fontSize: size }}
                >
                  {fontSizes[size]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FontSwitcher;
