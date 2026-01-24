import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

const paymentMethods = [
  { src: "/payments/fonepay.svg", alt: "FonePay" },
  { src: "/payments/esewa.svg", alt: "Esewa" },
  { src: "/payments/khalti.svg", alt: "Khalti" },
  { src: "/payments/nepalpay.svg", alt: "Nepalpay" },
  { src: "/payments/visa.svg", alt: "Visa" },
  { src: "/payments/mastercard.svg", alt: "Mastercard" },
  { src: "/payments/bank-transfer.svg", alt: "Bank Transfer" },
  { src: "/payments/cash-on-delivery.svg", alt: "Cash On Delivery" },
];

const Payments = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null); // Reference to the popup

  const handleFonePayClick = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the popup
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        closePopup();
      }
    };

    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isPopupOpen]);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {paymentMethods.map((method, index) => (
          <div
            key={index}
            className="py-2 px-2 border rounded hover-bg-neutral-1 cursor-pointer"
            onClick={
              [
                "FonePay",
                "Esewa",
                "Khalti",
                "Bank Transfer",
              ].includes(method.alt)
                ? handleFonePayClick
                : undefined
            }
          >
            <Image src={method.src} width={42} height={35} alt={method.alt} />
          </div>
        ))}
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999999]">
          <div
            ref={popupRef} // Attach ref to the popup container
            className="bg-white rounded-[18px] p-10 shadow-lg text-center items-center flex gap-5 flex-col relative"
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-2 text-[12px] hover:text-red-50 right-2 bg-neutral-0 hover:bg-red-500 rounded-full px-2 py-2   focus:outline-none leading-[9px]"
              aria-label="Close Popup"
            >
              ✕
            </button>

            <div className="flex flex-col gap-2">
              <Image
                src="/app-icon.svg"
                width={60}
                height={60}
                alt="Fonepay Icon"
                className="m-auto pb-2 "
              />
              <div className="flex gap-2 items-center">
                <h2 className="text-[16px] font-semibold">We Accept</h2>
                <Image
                  src="/payments/fonepay.svg"
                  width={90}
                  height={38}
                  alt="Fonepay Icon"
                  className="m-auto"
                />
              </div>
            </div>
            <Image
              src="/payments/vhandar-fonepay-qr-code.svg"
              width={300}
              height={300}
              alt="Vhandar Fonepay QR Code"
              className="m-auto p-4 border"
            />
            <p className="text-[14px] font-medium color-neutral-7">
              Terminal: 2222030016805652
            </p>
            <div className="flex flex-col gap-1 text-[14px] font-medium color-neutral-9">
              <p className="font-bold text-[18px] color-primary-700 ">
                VHANDAR MERCHANDISE PVT LTD
              </p>
              <p>Bank: GLOBAL IME BANK</p>
              <p>
                Account Number:{" "}
                <span className="font-bold color-primary-500">
                  32101010001540
                </span>
              </p>
              <p>Bank Branch: NEW BANESHWOR BRANCH</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
