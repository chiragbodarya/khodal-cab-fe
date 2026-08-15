import { useSearchParams } from 'react-router-dom';
import { useGetBlogsQuery } from '../redux/slices/blogApiSlice';
import { LuTag, LuArrowLeft, LuEye } from 'react-icons/lu';

export const Blogs = () => {
  const { data: blogData } = useGetBlogsQuery({});
  const blogs = blogData?.data || [];
  const [searchParams, setSearchParams] = useSearchParams();
  const blogId = searchParams.get('id');

  const activeBlog = blogs.find((b: any) => b.id === blogId);

  // Handle go back
  const handleBackToList = () => {
    setSearchParams({});
  };

  const renderBlogContent = (content: string) => {
    return content.split('\n\n').map((block, index) => {
      const trimmed = block.trim();
      if (trimmed.startsWith('###')) {
        const headingText = trimmed.replace(/^###\s*/, '');
        return (
          <h3
            key={index}
            className="text-theme-primary mt-8 mb-4 border-l-4 border-amber-400 pl-3 text-lg font-bold transition-colors sm:text-xl"
          >
            {headingText}
          </h3>
        );
      }
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        const items = trimmed.split('\n').map(li => li.replace(/^[-*]\s*/, ''));
        return (
          <ul
            key={index}
            className="text-theme-secondary my-4 list-inside list-disc space-y-2 pl-4"
          >
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
      <div className="animate-in text-theme-primary mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        {/* Back button */}
        <div>
          <button
            onClick={handleBackToList}
            className="bg-theme-card border-theme-muted hover:bg-theme-input inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold text-amber-500 shadow-sm transition-all hover:text-amber-600 hover:shadow-md dark:text-amber-400 dark:hover:text-amber-300"
          >
            <LuArrowLeft size={14} /> Back to Guides
          </button>
        </div>

        {/* Blog Post Content */}
        <article className="space-y-8">
          {/* Title & Category Area */}
          <div className="space-y-4 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:justify-start">
              {((activeBlog as any).tags || ['Travel']).map((t: string, i: number) => (
                <span
                  key={i}
                  className="text-amber-550 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[10px] font-bold tracking-wider uppercase dark:text-amber-400"
                >
                  {t}
                </span>
              ))}
              <span className="text-theme-muted text-xs">•</span>
              <span className="text-theme-muted flex items-center gap-1 text-xs font-medium">
                <LuEye size={13} className="text-amber-400" /> {(activeBlog as any).views || 0}{' '}
                Views
              </span>
            </div>

            <h1 className="text-theme-primary text-3xl leading-tight font-black tracking-tight sm:text-5xl">
              {(activeBlog as any).title}
            </h1>

            {/* Author Info */}
            <div className="flex items-center justify-center gap-3 pt-2 sm:justify-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/10 text-sm font-bold text-amber-500 dark:text-amber-400">
                {((activeBlog as any).author || 'Admin')[0].toUpperCase()}
              </div>
              <div className="text-left">
                <p className="text-theme-primary text-xs font-bold">
                  By {(activeBlog as any).author || 'Admin'}
                </p>
                <p className="text-theme-muted text-[10px]">{(activeBlog as any).date}</p>
              </div>
            </div>
          </div>

          {/* Large Cinematic Cover Photo */}
          <div className="bg-theme-input border-theme-muted aspect-[16/9] w-full overflow-hidden rounded-3xl border shadow-xl">
            <img
              src={
                (activeBlog as any).photo ||
                'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957'
              }
              alt={(activeBlog as any).title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Content Area */}
          <div className="border-theme-muted text-theme-secondary mx-auto max-w-3xl space-y-6 border-t pt-6 text-base leading-relaxed font-light">
            {renderBlogContent((activeBlog as any).content || '')}
          </div>
        </article>
      </div>
    );
  }

  // Render list view
  return (
    <div className="animate-in text-theme-primary mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-3 text-center">
        <h1 className="text-theme-primary text-3xl font-black sm:text-5xl">Travel Guides & Blog</h1>
        <p className="text-theme-secondary mx-auto max-w-xl text-sm font-light">
          Travel recommendations, fleet guides, SEO articles, and local secrets compiled by our
          experienced tourism guides.
        </p>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-amber-400" />
      </div>

      {/* Blogs List */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogs.map(blog => (
          <article
            key={blog.id}
            onClick={() => setSearchParams({ id: blog.id })}
            className="group bg-theme-card border-theme-muted flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border shadow-md transition-all hover:border-amber-400/30 dark:shadow-lg"
          >
            {/* Image */}
            <div className="relative aspect-video overflow-hidden">
              <img
                src={
                  (blog as any).photo || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957'
                }
                alt={(blog as any).title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1 rounded border border-zinc-800 bg-zinc-950/80 px-2 py-1 text-[10px] font-bold tracking-wider text-amber-400 uppercase backdrop-blur-md">
                <LuTag size={10} />
                {((blog as any).tags || [])[0] || 'Travel'}
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-grow flex-col justify-between space-y-6 p-6">
              <div className="space-y-3">
                <div className="text-theme-muted flex items-center gap-2 text-[10px] font-semibold">
                  <span>{(blog as any).author || 'Admin'}</span>
                  <span>•</span>
                  <span>{(blog as any).date}</span>
                </div>
                <h3 className="text-theme-primary text-lg leading-snug font-bold transition-colors group-hover:text-amber-500 dark:group-hover:text-amber-400">
                  {(blog as any).title}
                </h3>
                <p className="text-theme-secondary line-clamp-3 text-xs leading-relaxed font-light">
                  {(blog as any).excerpt}
                </p>
              </div>

              <div className="border-theme-muted flex items-center justify-between border-t pt-4 text-xs font-bold text-amber-500 group-hover:text-amber-600 dark:text-amber-400 dark:group-hover:text-amber-300">
                <span>Read Full Article</span>
                <span className="transform transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </article>
        ))}

        {blogs.length === 0 && (
          <div className="text-theme-muted col-span-full py-16 text-center">
            No blog articles found. Log in as admin to publish your first travel guide.
          </div>
        )}
      </div>
    </div>
  );
};
export default Blogs;
