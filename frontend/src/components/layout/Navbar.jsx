import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, ChevronDown, Rocket, ArrowRight } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/context/AppContext";

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [isTickerPaused, setIsTickerPaused] = useState(false);
  const navigate = useNavigate();

  const {
    categories,
    isCategoriesLoading,
    headlines: latestArticles,
  } = useApp();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  const getArticleLink = (article) => {
    const categorySlug =
      typeof article.category === "object"
        ? article.category.slug
        : "uncategorized";
    const subcategorySlug =
      article.subcategories &&
      article.subcategories.length > 0 &&
      typeof article.subcategories[0] === "object"
        ? article.subcategories[0].slug
        : "general";
    return article.slug && article.publicId
      ? `/${categorySlug}/${subcategorySlug}/${article.slug}-${article.publicId}`
      : `/articles/${article._id}`;
  };

  return (
    <header className="z-50 bg-white sticky top-0 border-b-4 border-zinc-950 shadow-xl">
      {/* Breaking News Ticker */}
      {/* Breaking News Ticker — shows on ALL screen sizes */}
      <div className="bg-primary text-primary-foreground border-y border-primary/20 py-1.5 overflow-hidden">
        <div className="px-4 flex items-center gap-3 md:gap-8">
          {/* Badge */}
          <div className="flex-shrink-0 flex items-center gap-1.5 px-2 md:px-4 py-1 bg-red-600 text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] italic animate-pulse rounded">
            <Rocket className="w-3 h-3 md:w-3.5 md:h-3.5 fill-current" />
            <span className="hidden sm:inline">Breaking</span> News
          </div>

          {/* Scrolling ticker */}
          <div className="flex-1 relative overflow-hidden h-6">
            <div
              className="animate-infinite-scroll flex gap-8 md:gap-12 whitespace-nowrap py-1"
              style={{
                animationPlayState: isTickerPaused ? "paused" : "running",
              }}
            >
              {latestArticles &&
                [...latestArticles, ...latestArticles].map((article, idx) => (
                  <Link
                    key={`${article._id}-${idx}`}
                    to={getArticleLink(article)}
                    className="flex items-center gap-2 md:gap-3 text-[11px] md:text-[13px] font-bold uppercase tracking-wider hover:text-red-500 transition-colors group"
                    onMouseEnter={() => setIsTickerPaused(true)}
                    onMouseLeave={() => setIsTickerPaused(false)}
                  >
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full group-hover:scale-150 transition-transform flex-shrink-0" />
                    {article.title}
                  </Link>
                ))}
              {!latestArticles && (
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Loading the latest intelligence from around the globe...
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Nav Bar ── */}
      <div className="bg-white/95 backdrop-blur-md relative">
        

        <div className="flex items-center h-20 lg:h-24 pt-3 lg:pt-0 px-4 lg:px-8">
          {/* LEFT: Hamburger (mobile) + BIG Logo */}
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Big Logo */}
            <Link to="/" className="flex items-center">
              <img
                src="/logo1.webp"
                alt="logo"
                className="h-12 lg:h-20 w-auto max-w-[150px] lg:max-w-none object-contain lg:ml-12"
              />
            </Link>
          </div>

          {/* RIGHT: Nav links + Search — pushed to far right with ml-auto */}
          <div className="ml-auto flex items-center h-full">
            {/* Desktop Nav links */}
            <nav className="hidden lg:flex items-center h-full">
              <Link
                to="/"
                className="px-4 h-full flex items-center text-[19px] font-semibold text-[#1f2937] tracking-wide border-r border-zinc-100 hover:text-primary hover:bg-zinc-50 transition-all whitespace-nowrap"
              >
                Home
              </Link>

              {!isCategoriesLoading &&
                categories?.slice(0, 8).map((cat) => (
                  <DropdownMenu key={cat._id}>
                    <DropdownMenuTrigger asChild>
                      <button className="px-4 h-full flex items-center cursor-pointer gap-1 text-[20px] font-semibold text-[#1f2937] tracking-wide  border-zinc-100 hover:text-red-600 hover:bg-zinc-50 transition-all outline-none whitespace-nowrap">
                        {cat.name}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="rounded-none border-4 border-zinc-950 p-4 w-64 shadow-2xl">
                      <DropdownMenuItem asChild>
                        <Link
                          to={`/category/${cat.slug}`}
                          className="font-black text-red-600 mb-2 block p-2 cursor-pointer"
                        >
                          SEE ALL {cat.name}
                        </Link>
                      </DropdownMenuItem>
                      {cat.subcategories?.map((sub) => (
                        <DropdownMenuItem key={sub._id} asChild>
                          <Link
                            to={`/subcategory/${cat.slug}/${sub.slug}`}
                            className="p-2 font-bold hover:text-red-600 text-[16px] cursor-pointer"
                          >
                            {sub.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ))}
            </nav>

            {/* Search — always on the far right */}
            <div className="flex items-center pl-4 border-l border-zinc-100 h-full ml-2">
              {/* Desktop search */}
              <form
                onSubmit={handleSearch}
                className="hidden sm:flex items-center relative group"
              >
                <Search className="absolute left-3 w-4 h-4 text-zinc-400 group-focus-within:text-red-600 transition-colors" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 bg-transparent text-xs font-bold uppercase tracking-widest border-b border-transparent focus:border-red-600 focus:outline-none w-32 focus:w-52 transition-all duration-300"
                />
              </form>

              {/* Mobile search icon */}
              <button
                className="lg:hidden p-2 hover:text-red-600 transition-colors"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 w-full bg-white p-4 border-b-4 border-red-600 shadow-xl z-40 animate-in slide-in-from-top-2 sm:hidden">
            <form onSubmit={handleSearch} className="flex items-center gap-4">
              <Search className="w-5 h-5 text-red-600 flex-shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Search headlines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 cursor-pointer text-lg font-bold uppercase tracking-tight outline-none placeholder:text-zinc-300"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
              >
                <X className="w-6 h-6 text-zinc-900 " />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent
          side="left"
          className="w-[85%] p-0 border-r-8 border-red-600 overflow-y-auto no-scrollbar"
        >
          <div className="bg-zinc-200 p-8 text-white">
            <Link to="/" className="flex items-center cursor-pointer">
              <img
                src="/logo1.webp"
                alt="logo"
                className="h-14 w-auto object-contain"
              />
            </Link>
          </div>
          <nav className="p-6 flex flex-col gap-2">
            <Link
              to="/"
              className="text-xl p-4 border-b border-zinc-100 font-serif text-[#1f2937]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-xl p-4 border-b border-zinc-100 font-serif text-[#1f2937]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            {!isCategoriesLoading &&
              categories?.map((cat) => {
                const isOpen = openCategoryId === cat._id;
                const hasSubcategories =
                  cat.subcategories && cat.subcategories.length > 0;
                return (
                  <div
                    key={cat._id}
                    className="flex flex-col border-b border-zinc-200"
                  >
                    {/* Category Row */}
                    <div className="flex items-center justify-between">
                      <Link
                        to={`/category/${cat.slug}`}
                        className="flex-1 text-[19px] font-semibold font-serif text-[#1f2937] px-4 py-3 tracking-tight hover:text-red-600 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {cat.name}
                      </Link>
                      {hasSubcategories && (
                        <button
                          onClick={() =>
                            setOpenCategoryId(isOpen ? null : cat._id)
                          }
                          className="p-3 pr-4 text-zinc-500 hover:text-red-600 transition-colors cursor-pointer"
                          aria-label={isOpen ? "Collapse" : "Expand"}
                        >
                          <ChevronDown
                            className={`w-5 h-5 transition-transform duration-300 ${
                              isOpen ? "rotate-180 text-red-600" : ""
                            }`}
                          />
                        </button>
                      )}
                      {!hasSubcategories && (
                        <span className="p-3 pr-4 text-zinc-400">
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </div>

                    {/* Subcategory Dropdown */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        isOpen ? "max-h-auto opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="bg-zinc-50 border-l-4 border-red-600 ml-4 mb-2">
                        <Link
                          to={`/category/${cat.slug}`}
                          className="flex items-center gap-2 px-4 py-2 text-[13px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <ArrowRight className="w-3 h-3" />
                          See All {cat.name}
                        </Link>
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub._id}
                            to={`/subcategory/${cat.slug}/${sub.slug}`}
                            className="flex items-center gap-2 px-4 py-2.5 text-[15px] font-medium text-zinc-700 hover:text-red-600 hover:bg-red-50 transition-colors border-t border-zinc-200"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                            <span className="break-words line-clamp-2">
                              {sub.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
