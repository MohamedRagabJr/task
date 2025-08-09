"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

interface SwipperProps {
  productImages: string[];
  className?: string;
  showThumbs?: boolean;
  slidesPerView?: number;
}

export default function Swipper({
  productImages,
  className = "",
  showThumbs = true,
  slidesPerView = 4,
}: SwipperProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const handleThumbsSwiper = (swiper: SwiperType): void => {
    setThumbsSwiper(swiper);
  };

  if (!productImages || productImages.length === 0) {
    return (
      <div className={`swiper-container px-8 ${className}`}>
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded">
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    );
  }

  const shouldShowThumbs = showThumbs && productImages.length > 1;

  return (
    <div className={`swiper-container px-8 ${className}`}>
      <Swiper
        loop={productImages.length > 1}
        spaceBetween={10}
        navigation={productImages.length > 1}
        thumbs={shouldShowThumbs ? { swiper: thumbsSwiper } : undefined}
        modules={[FreeMode, Navigation, Thumbs]}
        className="main-swiper mb-4"
      >
        {productImages.map((image, index) => (
          <SwiperSlide key={`main-${index}`}>
            <div className="aspect-square flex items-center justify-center bg-gray-50">
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-image.jpg";
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {shouldShowThumbs && (
        <Swiper
          onSwiper={handleThumbsSwiper}
          loop={false}
          spaceBetween={10}
          slidesPerView={Math.min(slidesPerView, productImages.length)}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="thumbs-swiper"
        >
          {productImages.map((image, index) => (
            <SwiperSlide key={`thumb-${index}`}>
              <div className="aspect-square border-2 border-transparent hover:border-blue-500 transition-colors cursor-pointer">
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-thumbnail.jpg";
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}

export function AdvancedSwipper({
  productImages,
  className = "",
  showThumbs = true,
  slidesPerView = 4,
  onImageChange,
}: SwipperProps & {
  onImageChange?: (index: number) => void;
}) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleThumbsSwiper = (swiper: SwiperType): void => {
    setThumbsSwiper(swiper);
  };

  const handleSlideChange = (swiper: SwiperType): void => {
    const newIndex = swiper.realIndex || swiper.activeIndex;
    setActiveIndex(newIndex);
    onImageChange?.(newIndex);
  };

  if (!productImages || productImages.length === 0) {
    return (
      <div className={`swiper-container px-8 ${className}`}>
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded">
          <p className="text-gray-500">No images available</p>
        </div>
      </div>
    );
  }

  const shouldShowThumbs = showThumbs && productImages.length > 1;

  return (
    <div className={`swiper-container px-8 ${className}`}>
      {/* Image counter */}
      {productImages.length > 1 && (
        <div className="text-center mb-2 text-sm text-gray-600">
          {activeIndex + 1} / {productImages.length}
        </div>
      )}

      {/* Main Swiper */}
      <Swiper
        loop={productImages.length > 1}
        spaceBetween={10}
        navigation={productImages.length > 1}
        thumbs={shouldShowThumbs ? { swiper: thumbsSwiper } : undefined}
        modules={[FreeMode, Navigation, Thumbs]}
        className="main-swiper mb-4"
        onSlideChange={handleSlideChange}
      >
        {productImages.map((image, index) => (
          <SwiperSlide key={`main-${index}`}>
            <div className="aspect-square flex items-center justify-center bg-gray-50 relative">
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-image.jpg";
                }}
              />
              {/* Zoom indicator */}
              <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                Click to zoom
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {shouldShowThumbs && (
        <Swiper
          onSwiper={handleThumbsSwiper}
          loop={false}
          spaceBetween={10}
          slidesPerView={Math.min(slidesPerView, productImages.length)}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="thumbs-swiper"
        >
          {productImages.map((image, index) => (
            <SwiperSlide key={`thumb-${index}`}>
              <div
                className={`aspect-square border-2 transition-colors cursor-pointer rounded overflow-hidden ${
                  index === activeIndex
                    ? "border-blue-500"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-thumbnail.jpg";
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
