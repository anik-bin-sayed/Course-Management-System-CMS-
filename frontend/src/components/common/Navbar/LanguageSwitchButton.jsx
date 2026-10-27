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
      className="flex items-center gap-2.5 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 ease-in-out group cursor-pointer"
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
        className="w-6 h-4 object-cover rounded shadow-sm border border-gray-100"
      />

      <span className="text-sm font-semibold text-gray-700 group-hover:text-black">
        {language === "bn" ? "EN" : "BN"}
      </span>
    </button>
  );
};

export default LanguageSwitchButton;
