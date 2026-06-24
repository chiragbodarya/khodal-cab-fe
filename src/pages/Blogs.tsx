import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getBlogs, type Blog } from "../utils/storage";
import { LuTag, LuArrowLeft, LuEye } from "react-icons/lu";

export const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const blogId = searchParams.get("id");

  useEffect(() => {
    setBlogs(getBlogs());
  }, [blogId]);

  const activeBlog = blogs.find((b) => b.id === blogId);

  // Handle go back
  const handleBackToList = () => {
    setSearchParams({});
  };

  const renderBlogContent = (content: string) => {
    return content.split("\n\n").map((block, index) => {
      const trimmed = block.trim();
      if (trimmed.startsWith("###")) {
        const headingText = trimmed.replace(/^###\s*/, "");
        return (
          <h3 key={index} className="text-lg sm:text-xl font-bold text-theme-primary mt-8 mb-4 border-l-4 border-amber-400 pl-3 transition-colors">
            {headingText}
          </h3>
        );
      }
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        const items = trimmed.split("\n").map(li => li.replace(/^[-*]\s*/, ""));
        return (
          <ul key={index} className="list-disc list-inside pl-4 space-y-2 my-4 text-theme-secondary">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={index} className="text-theme-secondary text-sm leading-relaxed font-light">
          {trimmed}
        </p>
      );
    });
  };

  // Render detail view
  if (blogId && activeBlog) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in text-theme-primary">
        {/* Back button */}
        <div>
          <button
            onClick={handleBackToList}
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-all cursor-pointer bg-theme-card border border-theme-muted px-4 py-2 rounded-xl shadow-sm hover:shadow-md hover:bg-theme-input"
          >
            <LuArrowLeft size={14} /> Back to Guides
          </button>
        </div>

        {/* Blog Post Content */}
        <article className="space-y-8">
          {/* Title & Category Area */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              {activeBlog.tags.map((t, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-550 dark:text-amber-400 border border-amber-400/20 text-[10px] uppercase font-bold tracking-wider"
                >
                  {t}
                </span>
              ))}
              <span className="text-xs text-theme-muted">•</span>
              <span className="flex items-center gap-1 text-xs text-theme-muted font-medium">
                <LuEye size={13} className="text-amber-400" /> {activeBlog.views} Views
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black text-theme-primary leading-tight tracking-tight">
              {activeBlog.title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-amber-400/10 text-amber-500 dark:text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-400/20">
                {activeBlog.author[0].toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-theme-primary">By {activeBlog.author}</p>
                <p className="text-[10px] text-theme-muted">{activeBlog.date}</p>
              </div>
            </div>
          </div>

          {/* Large Cinematic Cover Photo */}
          <div className="aspect-[16/9] w-full rounded-3xl overflow-hidden bg-theme-input shadow-xl border border-theme-muted">
            <img
              src={activeBlog.photo}
              alt={activeBlog.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Area */}
          <div className="max-w-3xl mx-auto pt-6 border-t border-theme-muted space-y-6 text-base leading-relaxed text-theme-secondary font-light">
            {renderBlogContent(activeBlog.content)}
          </div>
        </article>
      </div>
    );
  }

  // Render list view
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in text-theme-primary">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-theme-primary">Travel Guides & Blog</h1>
        <p className="text-theme-secondary text-sm max-w-xl mx-auto font-light">
          Travel recommendations, fleet guides, SEO articles, and local secrets compiled by our experienced tourism guides.
        </p>
        <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full mt-4" />
      </div>

      {/* Blogs List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <article
            key={blog.id}
            onClick={() => setSearchParams({ id: blog.id })}
            className="group rounded-2xl bg-theme-card border border-theme-muted overflow-hidden hover:border-amber-400/30 transition-all flex flex-col h-full shadow-md dark:shadow-lg cursor-pointer"
          >
            {/* Image */}
            <div className="relative aspect-video overflow-hidden">
              <img
                src={blog.photo}
                alt={blog.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-2 py-1 rounded bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <LuTag size={10} />
                {blog.tags[0] || "Travel"}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] text-theme-muted font-semibold">
                  <span>{blog.author}</span>
                  <span>•</span>
                  <span>{blog.date}</span>
                </div>
                <h3 className="text-lg font-bold text-theme-primary group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors leading-snug">
                  {blog.title}
                </h3>
                <p className="text-theme-secondary text-xs font-light line-clamp-3 leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-theme-muted flex items-center justify-between text-xs text-amber-500 dark:text-amber-400 font-bold group-hover:text-amber-600 dark:group-hover:text-amber-300">
                <span>Read Full Article</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </article>
        ))}

        {blogs.length === 0 && (
          <div className="col-span-full py-16 text-center text-theme-muted">
            No blog articles found. Log in as admin to publish your first travel guide.
          </div>
        )}
      </div>
    </div>
  );
};
export default Blogs;
