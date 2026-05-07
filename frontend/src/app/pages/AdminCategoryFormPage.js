import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCategoryById, createCategory, updateCategory } from '../../services/api';
import { Loader2, ArrowLeft } from 'lucide-react';

export function AdminCategoryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });

  useEffect(() => {
    if (isEditMode && id) {
      loadCategory(parseInt(id));
    }
  }, [id, isEditMode]);

  const loadCategory = async (categoryId) => {
    try {
      setLoading(true);
      const category = await getCategoryById(categoryId);
      setFormData({
        name: category.name,
        slug: category.slug,
      });
    } catch (err) {
      setError(err?.message || 'Failed to load category');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (name) => {
    setFormData({
      name,
      slug: generateSlug(name),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (isEditMode && id) {
        await updateCategory(parseInt(id), formData);
      } else {
        await createCategory(formData);
      }

      navigate('/admin/categories');
    } catch (err) {
      setError(err?.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <button
        onClick={() => navigate('/admin/categories')}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Categories
      </button>

      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? 'Edit Category' : 'Create New Category'}
      </h1>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 space-y-6">
        <div>
          <label className="block mb-2 font-semibold">
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder="e.g., Cardio Equipment"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Slug <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder="e.g., cardio-equipment"
          />
          <p className="text-sm text-gray-500 mt-2">
            The slug is used in URLs and is automatically generated from the category name.
            Use lowercase letters, numbers, and hyphens only.
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="h-5 w-5 animate-spin" />}
            {saving ? 'Saving...' : isEditMode ? 'Update Category' : 'Create Category'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/categories')}
            className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
