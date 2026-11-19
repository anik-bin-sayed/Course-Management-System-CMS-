import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LanguageSwitchButton = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const isBangla =
    location.pathname === "/bn" || location.pathname.startsWith("/bn/");

  const language = isBangla ? "bn" : "en";

  const toggleLanguage = async () => {
    const newLanguage = language === "bn" ? "en" : "bn";

    let newPath = location.pathname;

    if (newLanguage === "bn") {
      newPath = newPath === "/" ? "/bn" : `/bn${newPath}`;
    } else {
      newPath = newPath === "/bn" ? "/" : newPath.replace(/^\/bn(?=\/)/, "");
    }

    await i18n.changeLanguage(newLanguage);

    document.documentElement.lang = newLanguage;

    navigate(`${newPath}${location.search}${location.hash}`);
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className="group inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 text-xs font-bold text-gray-700 transition duration-200 hover:border-[#1b704b]/30 hover:bg-[#f4f8f5] hover:text-[#1b704b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b704b]"
      title={i18n.t("common.language")}
      aria-label={i18n.t(
        language === "bn" ? "common.switchToEnglish" : "common.switchToBangla",
      )}
    >
      <img
        src={
          language === "bn"
            ? "https://flagcdn.com/w40/us.png"
            : "https://flagcdn.com/w40/bd.png"
        }
        alt={language === "bn" ? "Bangla" : "English"}
        className="h-4 w-6 rounded-sm border border-gray-200 object-cover shadow-sm"
      />

      <span className="tracking-wide">
        {language === "bn" ? "EN" : "BN"}
      </span>
    </button>
  );
};

export default LanguageSwitchButton;
