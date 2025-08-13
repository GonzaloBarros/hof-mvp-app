import React from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

interface ImageSliderProps {
  beforeImage: string;
  afterImage: string;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ beforeImage, afterImage }) => {
  return (
    <div className="rounded-xl overflow-hidden shadow-lg border">
      <ReactCompareSlider
        itemOne={<ReactCompareSliderImage src={beforeImage} alt="Imagem Antes" />}
        itemTwo={<ReactCompareSliderImage src={afterImage} alt="Imagem Depois" />}
        style={{ height: '50vh', width: '100%' }}
      />
    </div>
  );
};
