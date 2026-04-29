import { notFound } from "next/navigation";
import { getBlog } from "@/lib/db/blogs-repo";
import BlogForm from "@/components/admin/BlogForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditBlogPage({ params }: PageProps) {
  const { id } = await params;
  const blog = await getBlog(id);
  if (!blog) notFound();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">編輯網誌</h1>
        <p className="text-text-muted text-sm mt-1 font-mono">{blog.id}</p>
      </div>
      <BlogForm initial={blog} isEdit />
    </div>
  );
}
