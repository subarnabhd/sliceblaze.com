
"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getBusinesses } from "@/lib/supabase";


export default function BusinessLogoSlider() {
  interface BusinessLogo {
    business_logo: string;
    username: string;
  }
  const [logos, setLogos] = useState<BusinessLogo[]>([]);

  useEffect(() => {
    async function fetchLogos() {
      const businesses = await getBusinesses();
      setLogos(
        (businesses || [])
          .filter((b: { business_logo?: string; username?: string }) => !!b.business_logo && !!b.username)
          .map((b: { business_logo: string; username: string }) => ({
            business_logo: b.business_logo,
            username: b.username,
          }))
      );
    }
    fetchLogos();
  }, []);

  const settings = {
    infinite: true,
    speed: 2000,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    arrows: false,
    pauseOnHover: true,
    variableWidth: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <div style={{ position: "relative", width: "100%", padding: "15px" }}>
      <h1 className="text-2xl font-semibold text-center mb-6">
        Trusted by businesses of all sizes
      </h1>
      {/* Gradient overlays */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 100,
          pointerEvents: "none",
          zIndex: 2,
          background: "linear-gradient(to right, white 15%, transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 100,
          pointerEvents: "none",
          zIndex: 2,
          background: "linear-gradient(to left, white 25%, transparent)",
        }}
      />
      <Slider {...settings} style={{ position: "relative", zIndex: 1 }}>
        {logos.length === 0
          ? Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                style={{
                  minWidth: 100,
                  minHeight: 100,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 18px",
                }}
              >
                <div className="logo-skeleton" />
              </div>
            ))
          : logos.map((logo, idx) => (
            <div
              key={idx}
              style={{
                minWidth: 100,
                minHeight: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 18px",
              }}
            >
              <Link href={`/${logo.username}`} style={{ display: "block" }}>
                <Image
                  src={logo.business_logo}
                  alt={`Business Logo ${idx + 1}`}
                  width={80}
                  height={80}
                  style={{
                    filter: "grayscale(1)",
                    transition: "filter 0.3s",
                  }}
                  className="business-logo"
                />
              </Link>
            </div>
          ))}
      </Slider>
      <style jsx>{`
        .business-logo:hover {
          filter: none !important;
        }
        @media (max-width: 768px) {
          .business-logo {
            width: 56px !important;
            height: 56px !important;
          }
        }
        @media (max-width: 480px) {
          .business-logo {
            width: 40px !important;
            height: 40px !important;
          }
        }
      `}</style>
    </div>
  );
}
