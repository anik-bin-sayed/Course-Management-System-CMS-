import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const CategoryNav = ({
  categories = [],
  isNavbarVisible = true,
  onCategoryClick,
  activeCategory: externalActive = null,
  className = "",
}) => {
  const navScrollRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [activeCategory, setActiveCategory] = useState(
    externalActive ?? categories?.[0]?.id ?? null,
  );

  useEffect(() => {
    if (externalActive !== null && externalActive !== undefined) {
      setActiveCategory(externalActive);
    } else if (categories?.length > 0) {
      setActiveCategory((prev) => prev ?? categories[0].id);
    }
  }, [externalActive, categories]);

  const updateScrollButtons = useCallback(() => {
    const el = navScrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollButtons();

    const el = navScrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [categories, updateScrollButtons]);

  const scrollNav = (direction) => {
    const el = navScrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const scrollToCategory = (categoryId) => {
    setActiveCategory(categoryId);

    if (typeof onCategoryClick === "function") {
      onCategoryClick(categoryId);
    }

    const target = document.getElementById(`category-${categoryId}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!categories || categories.length === 0) return null;

  return (
    <section
      className={`sticky z-40 mx-auto max-w-7xl  backdrop-blur-md transition-[top] duration-150 ease-out ${
        isNavbarVisible ? "top-20" : "top-0"
      } ${className}`}
    >
      <div className=" px-12">
        <div className="relative px-14  bg-gray-100">
          {canScrollLeft && (
            <div className="border px-20 bg-black b">
              <button
                type="button"
                onClick={() => scrollNav("left")}
                aria-label="Scroll categories left"
                className="absolute left-1 top-1/2 z-20 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-1.5 text-gray-700 shadow-md transition hover:bg-yellow-400 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 sm:p-2"
              >
                <FiChevronLeft size={16} />
              </button>
            </div>
          )}

          <div
            ref={navScrollRef}
            className="scrollbar-hide flex gap-2 overflow-x-auto scroll-smooth px-12 py-3 sm:px-14 lg:px-16"
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => scrollToCategory(cat.id)}
                  className={`whitespace-nowrap rounded px-4 py-2 text-md font-medium transition-all duration-200 ${
                    isActive
                      ? " bg-gray-800 shadow-sm hover:bg-black text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {canScrollRight && (
            <>
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-white to-transparent" />
              <button
                type="button"
                onClick={() => scrollNav("right")}
                aria-label="Scroll categories right"
                className="absolute right-1 top-1/2 z-20 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-1.5 text-gray-700 shadow-md transition hover:bg-yellow-400 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400 sm:p-2"
              >
                <FiChevronRight size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryNav;
