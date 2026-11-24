import { CategoryForm } from "@/components/admin/category-form";

export default function NewCategoryPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-medium text-foreground">New category</h1>
      <CategoryForm />
    </div>
  );
}
