import Image from "next/image";
import Link from "next/link";
import { listBlogs } from "@/lib/db/blogs-repo";

export const revalidate = 60;

export default async function BlogPage() {
  const blogPosts = await listBlogs();

  return (
    <div className="bg-white min-h-screen">
      <div className="container-main py-10 md:py-14">
        <h1 className="text-[1.8rem] md:text-[2.2rem] font-bold text-text-primary mb-8 md:mb-12">
          美妝網誌
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block"
            >
              <article className="overflow-hidden rounded-xl border border-border-light hover:border-border transition-all duration-300 hover:shadow-md">
                <div className="relative aspect-[16/10] overflow-hidden bg-bg-secondary">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                <div className="p-5 md:p-6">
                  <p className="text-text-muted text-[12px] font-sans mb-2">
                    {post.date}
                  </p>
                  <h2 className="text-[1rem] md:text-[1.05rem] font-bold text-text-primary leading-snug mb-3 group-hover:text-accent-blue transition-colors duration-300">
                    {post.title}
                  </h2>
                  <p className="text-text-secondary text-[0.85rem] leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {blogPosts.length === 0 && (
          <div className="text-center py-20 text-text-muted">
            暫無網誌文章
          </div>
        )}
      </div>
    </div>
  );
}
