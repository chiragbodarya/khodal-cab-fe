import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getBlogs, type Blog } from "../utils/storage";
import { LuCalendar, LuUser, LuTag, LuArrowLeft, LuEye } from "react-icons/lu";

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

  // Render detail view
  if (blogId && activeBlog) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in">
        {/* Back button */}
        <button
          onClick={handleBackToList}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors cursor-pointer bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 rounded-xl shadow-sm"
        >
          <LuArrowLeft size={14} /> Back to Guides
        </button>

        {/* Blog Post Card */}
        <article className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 overflow-hidden shadow-lg dark:shadow-2xl p-6 sm:p-10 space-y-6">
          {/* Metadata */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {activeBlog.tags.map((t, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded bg-amber-400/10 text-amber-500 dark:text-amber-400 border border-amber-400/20 text-[10px] uppercase font-bold tracking-wider"
                >
                  {t}
                </span>
              ))}
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white leading-tight">
              {activeBlog.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-550 dark:text-zinc-400 font-light">
              <span className="flex items-center gap-1">
                <LuUser size={13} className="text-amber-500 dark:text-amber-400" /> By {activeBlog.author}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <LuCalendar size={13} className="text-amber-500 dark:text-amber-400" /> {activeBlog.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <LuEye size={13} className="text-amber-500 dark:text-amber-400" /> {activeBlog.views} Views
              </span>
            </div>
          </div>

          {/* Cover Photo */}
          <div className="aspect-video w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
            <img
              src={activeBlog.photo}
              alt={activeBlog.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Markdown Content (Render paragraphs cleanly) */}
          <div className="text-zinc-700 dark:text-zinc-350 text-sm leading-relaxed font-light space-y-4 whitespace-pre-line border-t border-zinc-150 dark:border-zinc-800/80 pt-6">
            {activeBlog.content}
          </div>
        </article>
      </div>
    );
  }

  // Render list view
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white">Travel Guides & Blog</h1>
        <p className="text-zinc-550 dark:text-zinc-400 text-sm max-w-xl mx-auto font-light">
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
            className="group rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-amber-400/30 transition-all flex flex-col h-full shadow-md dark:shadow-lg cursor-pointer"
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
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-semibold">
                  <span>{blog.author}</span>
                  <span>•</span>
                  <span>{blog.date}</span>
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors leading-snug">
                  {blog.title}
                </h3>
                <p className="text-zinc-650 dark:text-zinc-400 text-xs font-light line-clamp-3 leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-150 dark:border-zinc-800 flex items-center justify-between text-xs text-amber-500 dark:text-amber-400 font-bold group-hover:text-amber-600 dark:group-hover:text-amber-300">
                <span>Read Full Article</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </article>
        ))}

        {blogs.length === 0 && (
          <div className="col-span-full py-16 text-center text-zinc-500">
            No blog articles found. Log in as admin to publish your first travel guide.
          </div>
        )}
      </div>
    </div>
  );
};
export default Blogs;
