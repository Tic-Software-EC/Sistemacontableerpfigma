import { AlertCircle, CheckCircle2, ImageIcon, Trash2, Upload } from "lucide-react";

interface CompanyLogoUploadProps {
  logo: string;
  logoError: string;
  onLogoChange: (logo: string) => void;
  onErrorChange: (error: string) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CompanyLogoUpload({
  logo,
  logoError,
  onLogoChange,
  onErrorChange,
  onFileSelect,
}: CompanyLogoUploadProps) {
  const handleRemove = () => {
    onLogoChange("");
    onErrorChange("");
  };

  return (
    <div>
      <label className="block text-gray-400 text-sm font-medium mb-3">Logo de la Empresa</label>
      <div className="flex items-start gap-4">
        {/* Preview del logo */}
        <div className="flex-shrink-0">
          {logo ? (
            <div className="w-32 h-32 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden relative group">
              <img src={logo} alt="Logo preview" className="w-full h-full object-contain p-3" />
              {/* Overlay con hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleRemove}
                  className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 bg-white/5 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-xs text-gray-500">Sin logo</p>
              </div>
            </div>
          )}
        </div>

        {/* Botones y mensajes */}
        <div className="flex-1 space-y-3">
          <p className="text-gray-400 text-sm">
            El logo aparecerá en el sistema de la empresa. Formatos aceptados: PNG, JPG, GIF, SVG. Tamaño máximo: 2MB.
          </p>
          
          {/* Mensaje de error */}
          {logoError && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{logoError}</p>
            </div>
          )}

          {/* Mensaje de éxito */}
          {logo && !logoError && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
              <p className="text-green-400 text-sm">Logo cargado correctamente</p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3">
            <label className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{logo ? "Cambiar Logo" : "Subir Logo"}</span>
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml"
                onChange={onFileSelect}
                className="hidden"
              />
            </label>
            {logo && (
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2.5 border border-white/20 text-gray-300 hover:bg-white/5 hover:text-white rounded-lg text-sm transition-colors"
              >
                Eliminar Logo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
