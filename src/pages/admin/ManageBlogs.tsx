import { useState, useEffect } from "react";
import { getBlogs, saveBlogs, type Blog } from "../../utils/storage";
import { LuPlus, LuTrash2, LuPen, LuTag, LuUser, LuX } from "react-icons/lu";
import toast from "react-hot-toast";

const BLOG_PHOTO_PRESETS = [
  { label: "Road Trip Bus", url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80" },
  { label: "Sunset Taj Mahal", url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80" },
  { label: "Mountain Travel", url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80" },
  { label: "Beach Travel Pack", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" },
];

export const ManageBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("Rajesh Kumar");
  const [photo, setPhoto] = useState(BLOG_PHOTO_PRESETS[0].url);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    setBlogs(getBlogs());
  }, []);

  const openAddModal = () => {
    setEditingBlog(null);
    setTitle("");
    setExcerpt("");
    setContent("");
    setAuthor("Rajesh Kumar");
    setPhoto(BLOG_PHOTO_PRESETS[0].url);
    setTags(["Travel Guides", "Road Trip"]);
    setShowModal(true);
  };

  const openEditModal = (blog: Blog) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setAuthor(blog.author);
    setPhoto(blog.photo);
    setTags(blog.tags);
    setShowModal(true);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (idx: number) => {
    setTags(tags.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt || !content || !photo) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (editingBlog) {
      const updated = blogs.map((b) =>
        b.id === editingBlog.id
          ? { ...b, title, excerpt, content, author, photo, tags }
          : b
      );
      saveBlogs(updated);
      setBlogs(updated);
      toast.success("Blog article updated!");
    } else {
      const newBlog: Blog = {
        id: "blog_" + Date.now(),
        title,
        excerpt,
        content,
        author,
        date: new Date().toISOString().split("T")[0],
        photo,
        tags,
        views: Math.floor(Math.random() * 20) + 1,
      };
      const updated = [newBlog, ...blogs];
      saveBlogs(updated);
      setBlogs(updated);
      toast.success("New blog article published!");
    }

    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post? This might affect SEO links.")) {
      const updated = blogs.filter((b) => b.id !== id);
      saveBlogs(updated);
      setBlogs(updated);
      toast.success("Blog article deleted.");
    }
  };

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">SEO & Travel Blogs</h1>
          <p className="text-zinc-400 text-xs mt-1">
            Write travel guides, itinerary diaries, and articles to boost your search presence (SEO).
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-400/10"
        >
          <LuPlus size={16} /> Compose Blog
        </button>
      </div>

      {/* Blogs list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((b) => (
          <div
            key={b.id}
            className="rounded-2xl bg-zinc-900 border border-zinc-800/80 overflow-hidden flex flex-col justify-between h-full shadow-lg"
          >
            <div className="relative aspect-video">
              <img src={b.photo} alt={b.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-zinc-950/80 backdrop-blur-sm border border-zinc-850 text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                <LuTag size={10} />
                {b.tags[0] || "Travel"}
              </div>
            </div>

            <div className="p-5 flex-grow space-y-3">
              <div className="flex items-center gap-2 text-[10px] text-zinc-550 font-medium">
                <span className="flex items-center gap-1"><LuUser size={10} /> {b.author}</span>
                <span>•</span>
                <span>{b.date}</span>
              </div>
              <h3 className="text-base font-bold text-white leading-snug line-clamp-2">{b.title}</h3>
              <p className="text-zinc-400 text-xs font-light line-clamp-2 leading-relaxed">
                {b.excerpt}
              </p>
            </div>

            {/* Actions Bar */}
            <div className="px-5 py-4 border-t border-zinc-800/80 bg-zinc-950/20 flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-medium">
                {b.views} views
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(b)}
                  className="p-1.5 rounded bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Edit"
                >
                  <LuPen size={13} />
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-1.5 rounded bg-zinc-850 hover:bg-red-500/15 border border-zinc-800 text-zinc-455 hover:text-red-400 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <LuTrash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {blogs.length === 0 && (
          <div className="col-span-full py-16 text-center text-zinc-550 border border-dashed border-zinc-800 rounded-2xl">
            No blogs posted. Click "Compose Blog" to create your first article.
          </div>
        )}
      </div>

      {/* ── Compose Blog Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in">
          <div className="relative w-full max-w-3xl rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80">
              <h3 className="text-base font-bold text-white">
                {editingBlog ? "Edit Blog Article" : "Compose SEO Blog Article"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer"
              >
                <LuX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-grow text-xs text-zinc-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-zinc-450 font-semibold">Article Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Why Road Trips in Luxury Buses are the New Trend"
                    className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400/50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-zinc-450 font-semibold">Author *</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400/50"
                    required
                  />
                </div>
              </div>

              {/* Photo Selector */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-zinc-455 font-semibold">Cover Image URL *</label>
                  <span className="text-[10px] text-amber-400">Or pick a blog preset</span>
                </div>
                <input
                  type="text"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400/50"
                  required
                />
                <div className="flex gap-2 overflow-x-auto py-1">
                  {BLOG_PHOTO_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhoto(preset.url)}
                      className={`px-3 py-1 rounded bg-zinc-850 hover:bg-zinc-800 border text-[10px] font-semibold cursor-pointer ${
                        photo === preset.url ? "border-amber-400 text-amber-400" : "border-zinc-800 text-zinc-400"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-1">
                <label className="block text-zinc-455 font-semibold">Excerpt / Meta Description (SEO) *</label>
                <input
                  type="text"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Summarize the article in 1-2 sentences for google search snippet..."
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400/50"
                  required
                />
              </div>

              {/* Tags Builder */}
              <div className="space-y-2">
                <label className="block text-zinc-455 font-semibold">Article Tags</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="e.g. Travel Tips"
                    className="flex-grow bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400/50"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {tags.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold bg-zinc-950 border border-zinc-850 px-2.5 py-1 rounded-lg text-zinc-300"
                    >
                      #{item}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(idx)}
                        className="text-red-400 hover:text-red-300 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Content Body */}
              <div className="space-y-1">
                <label className="block text-zinc-455 font-semibold">Article Body Content *</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  placeholder="Write the full post here. You can use markdown sub-headings like ### to format your article sections..."
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400/50 font-mono text-[11px] leading-relaxed"
                  required
                />
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-800 hover:bg-zinc-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold cursor-pointer"
                >
                  {editingBlog ? "Save Changes" : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageBlogs;
