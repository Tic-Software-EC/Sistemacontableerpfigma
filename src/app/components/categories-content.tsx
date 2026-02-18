import { useState } from "react";
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  Palette,
  FolderOpen,
  Tag,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  parent: string | null;
  productsCount: number;
  active: boolean;
}

const predefinedColors = [
  "#E8692E", // Naranja primario
  "#3B82F6", // Azul
  "#10B981", // Verde
  "#F59E0B", // Amarillo
  "#EF4444", // Rojo
  "#8B5CF6", // Morado
  "#EC4899", // Rosa
  "#06B6D4", // Cyan
  "#84CC16", // Lima
  "#F97316", // Naranja oscuro
];

const iconOptions = [
  { value: "package", label: "Paquete", icon: "📦" },
  { value: "laptop", label: "Tecnología", icon: "💻" },
  { value: "shirt", label: "Ropa", icon: "👕" },
  { value: "utensils", label: "Alimentos", icon: "🍽️" },
  { value: "tools", label: "Herramientas", icon: "🔧" },
  { value: "home", label: "Hogar", icon: "🏠" },
  { value: "heart", label: "Salud", icon: "❤️" },
  { value: "book", label: "Educación", icon: "📚" },
  { value: "car", label: "Vehículos", icon: "🚗" },
  { value: "gamepad", label: "Entretenimiento", icon: "🎮" },
  { value: "sofa", label: "Muebles", icon: "🛋️" },
  { value: "motorcycle", label: "Motocicletas", icon: "🏍️" },
  { value: "toy", label: "Juguetes", icon: "🧸" },
  { value: "basket", label: "Bazar", icon: "🧺" },
];

export function CategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "1",
      name: "Electrónica",
      description: "Productos electrónicos y tecnológicos",
      color: "#3B82F6",
      icon: "laptop",
      parent: null,
      productsCount: 45,
      active: true,
    },
    {
      id: "2",
      name: "Computadoras",
      description: "Laptops, desktops y accesorios",
      color: "#3B82F6",
      icon: "laptop",
      parent: "1",
      productsCount: 28,
      active: true,
    },
    {
      id: "3",
      name: "Ropa",
      description: "Vestimenta y accesorios",
      color: "#EC4899",
      icon: "shirt",
      parent: null,
      productsCount: 120,
      active: true,
    },
    {
      id: "4",
      name: "Alimentos",
      description: "Productos alimenticios",
      color: "#10B981",
      icon: "utensils",
      parent: null,
      productsCount: 85,
      active: true,
    },
    {
      id: "5",
      name: "Herramientas",
      description: "Herramientas manuales y eléctricas",
      color: "#F59E0B",
      icon: "tools",
      parent: null,
      productsCount: 32,
      active: true,
    },
    {
      id: "6",
      name: "Muebles",
      description: "Muebles para hogar y oficina",
      color: "#8B5CF6",
      icon: "sofa",
      parent: null,
      productsCount: 68,
      active: true,
    },
    {
      id: "7",
      name: "Motocicletas",
      description: "Motos y accesorios para motocicletas",
      color: "#EF4444",
      icon: "motorcycle",
      parent: null,
      productsCount: 24,
      active: true,
    },
    {
      id: "8",
      name: "Juguetes",
      description: "Juguetes y artículos para niños",
      color: "#06B6D4",
      icon: "toy",
      parent: null,
      productsCount: 156,
      active: true,
    },
    {
      id: "9",
      name: "Bazar",
      description: "Artículos diversos y decoración",
      color: "#84CC16",
      icon: "basket",
      parent: null,
      productsCount: 92,
      active: true,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#E8692E",
    icon: "package",
    parent: "",
    active: true,
  });

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        color: category.color,
        icon: category.icon,
        parent: category.parent || "",
        active: category.active,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        description: "",
        color: "#E8692E",
        icon: "package",
        parent: "",
        active: true,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      color: "#E8692E",
      icon: "package",
      parent: "",
      active: true,
    });
  };

  const handleSaveCategory = () => {
    if (!formData.name.trim()) {
      alert("El nombre de la categoría es obligatorio");
      return;
    }

    if (editingCategory) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id
            ? {
                ...cat,
                name: formData.name,
                description: formData.description,
                color: formData.color,
                icon: formData.icon,
                parent: formData.parent || null,
                active: formData.active,
              }
            : cat
        )
      );
      alert("Categoría actualizada exitosamente");
    } else {
      const newCategory: Category = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        color: formData.color,
        icon: formData.icon,
        parent: formData.parent || null,
        productsCount: 0,
        active: formData.active,
      };
      setCategories([...categories, newCategory]);
      alert("Categoría creada exitosamente");
    }

    handleCloseModal();
  };

  const handleDeleteCategory = (id: string) => {
    const category = categories.find((cat) => cat.id === id);
    const hasChildren = categories.some((cat) => cat.parent === id);

    if (hasChildren) {
      alert("No puedes eliminar una categoría que tiene subcategorías");
      return;
    }

    if (category && category.productsCount > 0) {
      if (
        !confirm(
          `Esta categoría tiene ${category.productsCount} productos asociados. ¿Deseas continuar?`
        )
      ) {
        return;
      }
    }

    if (confirm("¿Estás seguro de eliminar esta categoría?")) {
      setCategories(categories.filter((cat) => cat.id !== id));
      alert("Categoría eliminada exitosamente");
    }
  };

  const getParentCategories = () => {
    return categories.filter((cat) => cat.parent === null);
  };

  const getChildCategories = (parentId: string) => {
    return categories.filter((cat) => cat.parent === parentId);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getIconEmoji = (iconValue: string) => {
    return iconOptions.find((opt) => opt.value === iconValue)?.icon || "📦";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
            <FolderTree className="w-8 h-8 text-primary" />
            Categorías
          </h2>
          <p className="text-gray-400 text-sm">
            Gestiona las categorías de productos para organizar tu inventario
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center gap-2 justify-center whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Nueva Categoría
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#0a1628] border border-white/5 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <FolderTree className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Total Categorías</p>
              <p className="text-white font-bold text-2xl">{categories.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#0a1628] border border-white/5 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Principales</p>
              <p className="text-white font-bold text-2xl">
                {getParentCategories().length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#0a1628] border border-white/5 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Subcategorías</p>
              <p className="text-white font-bold text-2xl">
                {categories.filter((cat) => cat.parent !== null).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#0a1628] border border-white/5 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Palette className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Activas</p>
              <p className="text-white font-bold text-2xl">
                {categories.filter((cat) => cat.active).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="bg-[#0f1825]/50 border border-white/5 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Search className="w-5 h-5 text-primary" />
          <span className="text-white font-medium">Buscar categoría</span>
        </div>
        <input
          type="text"
          placeholder="Nombre de la categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2.5 bg-[#0a1628] border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
        />
      </div>

      {/* Lista de categorías */}
      <div className="space-y-3">
        {filteredCategories.filter((cat) => cat.parent === null).map((category) => (
          <div key={category.id} className="space-y-2">
            {/* Categoría principal */}
            <div className="bg-[#0a1628] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {getIconEmoji(category.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-semibold text-lg">
                        {category.name}
                      </h3>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      {!category.active && (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                          Inactiva
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      {category.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-gray-500">
                        <span className="text-primary font-semibold">
                          {category.productsCount}
                        </span>{" "}
                        productos
                      </span>
                      {getChildCategories(category.id).length > 0 && (
                        <span className="text-gray-500">
                          <span className="text-blue-400 font-semibold">
                            {getChildCategories(category.id).length}
                          </span>{" "}
                          subcategorías
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(category)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Subcategorías */}
            {getChildCategories(category.id).map((subCategory) => (
              <div
                key={subCategory.id}
                className="bg-[#0f1825]/50 border border-white/5 rounded-xl p-4 ml-8 hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${subCategory.color}20` }}
                    >
                      {getIconEmoji(subCategory.icon)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-medium">
                          {subCategory.name}
                        </h4>
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: subCategory.color }}
                        ></div>
                        {!subCategory.active && (
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                            Inactiva
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-2">
                        {subCategory.description}
                      </p>
                      <span className="text-gray-500 text-xs">
                        <span className="text-primary font-semibold">
                          {subCategory.productsCount}
                        </span>{" "}
                        productos
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(subCategory)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(subCategory.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="bg-[#0a1628] border border-white/5 rounded-xl p-12 text-center">
            <FolderTree className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              No se encontraron categorías
            </p>
          </div>
        )}
      </div>

      {/* Modal de crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-[#0a1628] border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="sticky top-0 bg-[#0a1628] border-b border-white/10 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <FolderTree className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl">
                    {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {editingCategory
                      ? "Actualiza los datos de la categoría"
                      : "Completa la información de la nueva categoría"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-5">
              {/* Nombre */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Nombre de la categoría *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ej: Electrónica"
                  className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descripción breve de la categoría..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none"
                />
              </div>

              {/* Categoría padre */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Categoría padre (opcional)
                </label>
                <select
                  value={formData.parent}
                  onChange={(e) =>
                    setFormData({ ...formData, parent: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                >
                  <option value="">Sin categoría padre</option>
                  {getParentCategories()
                    .filter((cat) => cat.id !== editingCategory?.id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
                <p className="text-gray-500 text-xs mt-1">
                  Selecciona una categoría padre para crear una subcategoría
                </p>
              </div>

              {/* Icono */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-3">
                  Icono
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {iconOptions.map((iconOption) => (
                    <button
                      key={iconOption.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, icon: iconOption.value })
                      }
                      className={`p-4 rounded-lg border-2 transition-all text-2xl ${
                        formData.icon === iconOption.value
                          ? "border-primary bg-primary/10"
                          : "border-white/10 bg-[#0f1825] hover:border-white/20"
                      }`}
                      title={iconOption.label}
                    >
                      {iconOption.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-3">
                  Color
                </label>
                <div className="grid grid-cols-10 gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        formData.color === color
                          ? "ring-2 ring-white ring-offset-2 ring-offset-[#0a1628]"
                          : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Estado */}
              <div className="flex items-start gap-4 p-4 bg-[#0f1825]/50 rounded-lg border border-white/5">
                <div className="relative mt-0.5">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) =>
                      setFormData({ ...formData, active: e.target.checked })
                    }
                    className="sr-only peer"
                    id="categoryActive"
                  />
                  <label
                    htmlFor="categoryActive"
                    className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center cursor-pointer"
                  >
                    {formData.active && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </label>
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="categoryActive"
                    className="text-white font-medium text-sm block mb-1 cursor-pointer"
                  >
                    Categoría activa
                  </label>
                  <p className="text-gray-400 text-xs">
                    Solo las categorías activas se pueden asignar a productos
                  </p>
                </div>
              </div>
            </div>

            {/* Footer del modal */}
            <div className="border-t border-white/10 p-6 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCategory}
                className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {editingCategory ? "Actualizar" : "Crear"} Categoría
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}