import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/data/blogs";

export default function BlogPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="container-main py-10 md:py-14">
        {/* Page Title */}
        <h1 className="text-[1.8rem] md:text-[2.2rem] font-bold text-text-primary mb-8 md:mb-12">
          美妝網誌
        </h1>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <article className="overflow-hidden rounded-xl border border-border-light hover:border-border transition-all duration-300 hover:shadow-md">
                {/* Featured Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-bg-secondary">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                {/* Content */}
                <div className="p-5 md:p-6">
                  {/* Date */}
                  <p className="text-text-muted text-[12px] font-sans mb-2">
                    {post.date}
                  </p>

                  {/* Title */}
                  <h2 className="text-[1rem] md:text-[1.05rem] font-bold text-text-primary leading-snug mb-3 group-hover:text-accent-blue transition-colors duration-300">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-text-secondary text-[0.85rem] leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Pagination (UI only) */}
        <div className="flex items-center justify-center gap-2 mt-12 md:mt-16">
          <button
            disabled
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[0.85rem] text-text-muted border border-border-light cursor-not-allowed opacity-50"
          >
            &lt;
          </button>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center text-[0.85rem] font-semibold bg-accent-blue text-white">
            1
          </button>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center text-[0.85rem] text-text-secondary border border-border-light hover:border-accent-blue hover:text-accent-blue transition-colors">
            2
          </button>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center text-[0.85rem] text-text-secondary border border-border-light hover:border-accent-blue hover:text-accent-blue transition-colors">
            3
          </button>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center text-[0.85rem] text-text-secondary border border-border-light hover:border-accent-blue hover:text-accent-blue transition-colors">
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
