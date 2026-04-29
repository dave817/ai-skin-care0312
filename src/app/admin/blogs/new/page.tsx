import BlogForm from "@/components/admin/BlogForm";

export default function AdminNewBlogPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">新增網誌文章</h1>
        <p className="text-text-muted text-sm mt-1">填入文章內容後發佈</p>
      </div>
      <BlogForm />
    </div>
  );
}
