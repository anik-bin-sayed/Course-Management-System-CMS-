import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronDown } from "react-icons/fa";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const currentLanguage = i18n.resolvedLanguage || i18n.language;

  const changeLanguage = async (language) => {
    await i18n.changeLanguage(language);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!dropdownRef.current?.contains(event.target)) setIsOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-[#00A651] hover:text-[#00A651]"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <span className="text-lg">
          {currentLanguage === "bn" ? "🇧🇩" : "🌐"}
        </span>

        <span>{currentLanguage === "bn" ? "বাংলা" : "English"}</span>

        <FaChevronDown
          size={10}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-[60] mt-2 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white p-1 shadow-xl">
          <button
            type="button"
            onClick={() => changeLanguage("en")}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition hover:bg-gray-50 ${
              currentLanguage === "en"
                ? "bg-green-50 font-semibold text-[#00A651]"
                : "text-gray-700"
            }`}
          >
            <span>🌐</span>
            <span>English</span>

            {currentLanguage === "en" && <span className="ml-auto">✓</span>}
          </button>

          <button
            type="button"
            onClick={() => changeLanguage("bn")}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition hover:bg-gray-50 ${
              currentLanguage === "bn"
                ? "bg-green-50 font-semibold text-[#00A651]"
                : "text-gray-700"
            }`}
          >
            <span>🇧🇩</span>
            <span>বাংলা</span>

            {currentLanguage === "bn" && <span className="ml-auto">✓</span>}
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
