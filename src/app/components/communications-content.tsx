import { useState, useEffect } from "react";
import { Mail, Bell, MessageSquare, Smartphone, Users, Plus, Trash2, Server, Send, ChevronUp, Pencil, Check, X, AlertTriangle } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { SysTabBar, SysTab } from "./ui/sys-tab-bar";
import { useRoles } from "../contexts/roles-context";
import { toast } from "sonner";

// ── Helper compartido ─────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block mb-1.5 text-xs font-medium text-gray-500">{label}</label>
      {children}
    </div>
  );
}

// ── Tipos ─────────────────────────────────────────────────────────────────────
type Channel = "sistema" | "email" | "sms" | "whatsapp";

interface NotifEvent {
  id: string;
  label: string;
  desc: string;
  channels: Record<Channel, boolean>;
}

// Catálogo global de eventos del sistema
const ALL_SYSTEM_EVENTS: Omit<NotifEvent, "channels">[] = [
  { id: "inv_emitida",      label: "Factura emitida",            desc: "Al generar una nueva factura"              },
  { id: "pago_recibido",    label: "Pago recibido",              desc: "Al registrar un pago"                      },
  { id: "cierre_caja",      label: "Cierre de caja",             desc: "Al realizar el arqueo de caja"             },
  { id: "descuento_ap",     label: "Descuento aplicado > 10%",   desc: "Cuando se aplica un descuento mayor al 10%"},
  { id: "fac_por_vencer",   label: "Factura por vencer",         desc: "Facturas que vencen en 5 días"             },
  { id: "fac_vencida",      label: "Factura vencida",            desc: "Factura pasó su fecha de vencimiento"      },
  { id: "cliente_mora",     label: "Cliente en mora",            desc: "Cliente con +30 días de deuda vencida"     },
  { id: "stock_min",        label: "Stock mínimo alcanzado",     desc: "Producto llegó al nivel mínimo de stock"   },
  { id: "sin_stock",        label: "Producto sin stock",         desc: "Producto llegó a cero unidades"            },
  { id: "ingreso_merc",     label: "Ingreso de mercadería",      desc: "Al registrar recepción de productos"       },
  { id: "transf_pend",      label: "Transferencia pendiente",    desc: "Transferencia entre bodegas por aprobar"   },
  { id: "nueva_orden",      label: "Nueva orden de venta",       desc: "Al crear una nueva orden de venta"         },
  { id: "cot_aceptada",     label: "Cotización aceptada",        desc: "Cliente aprobó una cotización"             },
  { id: "meta_ventas",      label: "Meta de ventas alcanzada",   desc: "Se superó la meta mensual"                 },
  { id: "cierre_periodo",   label: "Cierre de período",          desc: "Al finalizar mes contable"                 },
  { id: "asiento_pend",     label: "Asiento por aprobar",        desc: "Asiento contable esperando aprobación"     },
  { id: "impuesto_proximo", label: "Declaración de impuestos",   desc: "Vence en 5 días la declaración al SRI"     },
  { id: "nuevo_usuario",    label: "Nuevo usuario registrado",   desc: "Se creó un nuevo usuario en el sistema"   },
  { id: "error_sistema",    label: "Error del sistema",          desc: "Error crítico detectado"                   },
  { id: "login_fallido",    label: "Intentos de login fallidos", desc: "3+ intentos fallidos en una cuenta"        },
  { id: "backup_ok",        label: "Backup completado",          desc: "Respaldo automático finalizado"            },
  { id: "nueva_compra",     label: "Nueva orden de compra",      desc: "Al generar una orden de compra"            },
  { id: "proveedor_pago",   label: "Pago a proveedor",           desc: "Al registrar pago a un proveedor"          },
];

const STORAGE_KEY_NOTIF = "ticsoftec_notif_config";

function loadNotifConfig(): Record<string, NotifEvent[]> {
  try {
    const s = localStorage.getItem(STORAGE_KEY_NOTIF);
    if (s) return JSON.parse(s);
  } catch {}
  return {};
}
function saveNotifConfig(cfg: Record<string, NotifEvent[]>) {
  try { localStorage.setItem(STORAGE_KEY_NOTIF, JSON.stringify(cfg)); } catch {}
}

// ── Canal helpers ─────────────────────────────────────────────────────────────
const CANALES: Channel[] = ["sistema", "email", "sms", "whatsapp"];
const CANAL_LABELS: Record<Channel, string> = { sistema: "Sistema", email: "Email", sms: "SMS", whatsapp: "WhatsApp" };

function CanalIcon({ canal }: { canal: Channel }) {
  if (canal === "email")    return <Mail className="w-3.5 h-3.5" />;
  if (canal === "sms")      return <Smartphone className="w-3.5 h-3.5" />;
  if (canal === "whatsapp") return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
  return <Bell className="w-3.5 h-3.5" />;
}

// ── Panel de Notificaciones por Rol (dinámico) ────────────────────────────────
function NotificationsByRole() {
  const { theme } = useTheme();
  const { roles } = useRoles();

  const [config, setConfig] = useState<Record<string, NotifEvent[]>>(loadNotifConfig);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [showAddEvent, setShowAddEvent] = useState(false);

  useEffect(() => {
    if (roles.length > 0 && !selectedRoleId) setSelectedRoleId(roles[0].id);
  }, [roles]);

  const isLight = theme === "light";
  const txt  = isLight ? "text-gray-900" : "text-white";
  const sub  = isLight ? "text-gray-500" : "text-gray-400";
  const card = `rounded-xl border ${isLight ? "bg-white border-gray-200 shadow-sm" : "bg-white/5 border-white/10"}`;

  const activeEvents: NotifEvent[] = config[selectedRoleId] ?? [];
  const availableToAdd = ALL_SYSTEM_EVENTS.filter(ev => !activeEvents.some(e => e.id === ev.id));

  const saveConfig = (next: Record<string, NotifEvent[]>) => { setConfig(next); saveNotifConfig(next); };

  const toggleChannel = (eventId: string, canal: Channel) => {
    const updated = activeEvents.map(ev =>
      ev.id !== eventId ? ev : { ...ev, channels: { ...ev.channels, [canal]: !ev.channels[canal] } }
    );
    saveConfig({ ...config, [selectedRoleId]: updated });
  };

  const addEvent = (ev: Omit<NotifEvent, "channels">) => {
    const fresh: NotifEvent = { ...ev, channels: { sistema: true, email: false, sms: false, whatsapp: false } };
    saveConfig({ ...config, [selectedRoleId]: [...activeEvents, fresh] });
    setShowAddEvent(false);
  };

  const removeEvent = (eventId: string) =>
    saveConfig({ ...config, [selectedRoleId]: activeEvents.filter(e => e.id !== eventId) });

  if (roles.length === 0) {
    return (
      <div className={`${card} p-10 text-center`}>
        <Users className={`w-12 h-12 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
        <p className={`text-sm ${sub}`}>
          No hay roles creados. Ve a <strong>Configuración → Roles y Permisos</strong> para crear roles.
        </p>
      </div>
    );
  }

  const selectedRole = roles.find(r => r.id === selectedRoleId);

  return (
    <div className="flex gap-4 min-h-[420px]">
      {/* Lista de roles */}
      <div className={`${card} w-56 flex-shrink-0 p-2 h-fit`}>
        <p className={`text-xs font-semibold uppercase tracking-wide px-2 py-2 ${isLight ? "text-gray-400" : "text-gray-500"}`}>
          Roles del sistema
        </p>
        {roles.map(role => {
          const count = (config[role.id] ?? []).length;
          return (
            <button
              key={role.id}
              onClick={() => setSelectedRoleId(role.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all text-sm mb-0.5 ${
                selectedRoleId === role.id
                  ? "bg-primary/15 text-primary font-semibold"
                  : isLight ? "text-gray-700 hover:bg-gray-100" : "text-gray-300 hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: role.color }} />
                <span className="truncate">{role.name}</span>
              </div>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex-shrink-0 ml-1 ${
                  selectedRoleId === role.id
                    ? "bg-primary/20 text-primary"
                    : isLight ? "bg-gray-200 text-gray-500" : "bg-white/10 text-gray-400"
                }`}>{count}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Configuración de eventos */}
      <div className="flex-1">
        <div className={card}>
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-inherit">
            {selectedRole && (
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: selectedRole.color }} />
            )}
            <div className="flex-1">
              <p className={`text-sm font-semibold ${txt}`}>{selectedRole?.name ?? "—"}</p>
              <p className={`text-xs ${sub}`}>
                {activeEvents.length} notificaci{activeEvents.length === 1 ? "ón" : "ones"} configurada{activeEvents.length === 1 ? "" : "s"}
              </p>
            </div>
            <button
              onClick={() => setShowAddEvent(true)}
              disabled={availableToAdd.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 disabled:opacity-40 text-white rounded-lg text-xs font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Agregar evento
            </button>
          </div>

          {/* Cabecera de columnas */}
          {activeEvents.length > 0 && (
            <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-2 items-center px-5 py-2.5 border-b border-inherit">
              <span className={`text-xs font-semibold uppercase tracking-wide ${isLight ? "text-gray-400" : "text-gray-500"}`}>Evento</span>
              {CANALES.map(c => (
                <div key={c} className="flex flex-col items-center gap-0.5 w-14">
                  <CanalIcon canal={c} />
                  <span className={`text-[10px] ${isLight ? "text-gray-400" : "text-gray-500"}`}>{CANAL_LABELS[c]}</span>
                </div>
              ))}
              <div className="w-6" />
            </div>
          )}

          {/* Filas de eventos */}
          <div className="divide-y divide-inherit">
            {activeEvents.map(ev => (
              <div key={ev.id} className={`grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-2 items-center px-5 py-3 transition-colors ${isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.02]"}`}>
                <div>
                  <p className={`text-sm font-medium ${txt}`}>{ev.label}</p>
                  <p className={`text-xs mt-0.5 ${sub}`}>{ev.desc}</p>
                </div>
                {CANALES.map(canal => (
                  <div key={canal} className="w-14 flex justify-center">
                    <button
                      onClick={() => toggleChannel(ev.id, canal)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        ev.channels[canal] ? "bg-primary border-primary" : isLight ? "border-gray-300" : "border-white/20"
                      }`}
                    >
                      {ev.channels[canal] && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      )}
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => removeEvent(ev.id)}
                  className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${isLight ? "text-gray-400 hover:text-red-500 hover:bg-red-50" : "text-gray-500 hover:text-red-400 hover:bg-red-400/10"}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {activeEvents.length === 0 && (
              <div className="px-5 py-12 text-center">
                <Bell className={`w-10 h-10 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                <p className={`text-sm font-medium ${txt}`}>Sin notificaciones configuradas</p>
                <p className={`text-xs mt-1 ${sub}`}>
                  Presiona <strong>Agregar evento</strong> para asignar notificaciones a este rol
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`px-5 py-3 border-t border-inherit rounded-b-xl ${isLight ? "bg-gray-50" : "bg-white/[0.02]"}`}>
            <p className={`text-xs ${sub}`}>
              <span className="text-primary font-semibold">Sistema</span> = notificación dentro de la app ·{" "}
              <span className="text-primary font-semibold">Email / SMS / WhatsApp</span> = requieren canal configurado en las otras pestañas
            </p>
          </div>
        </div>
      </div>

      {/* Modal agregar evento */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden ${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <p className={`font-semibold text-sm ${txt}`}>
                Agregar evento a <span className="text-primary">{selectedRole?.name}</span>
              </p>
              <button
                onClick={() => setShowAddEvent(false)}
                className={`p-1.5 rounded-lg ${isLight ? "hover:bg-gray-100 text-gray-500" : "hover:bg-white/5 text-gray-400"}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className={`max-h-80 overflow-y-auto divide-y ${isLight ? "divide-gray-100" : "divide-white/5"}`}>
              {availableToAdd.map(ev => (
                <button
                  key={ev.id}
                  onClick={() => addEvent(ev)}
                  className={`w-full text-left px-5 py-3 transition-colors ${isLight ? "hover:bg-gray-50" : "hover:bg-white/5"}`}
                >
                  <p className={`text-sm font-medium ${txt}`}>{ev.label}</p>
                  <p className={`text-xs mt-0.5 ${sub}`}>{ev.desc}</p>
                </button>
              ))}
              {availableToAdd.length === 0 && (
                <p className={`text-center py-8 text-sm ${sub}`}>Todos los eventos ya están asignados</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── WhatsApp icon ────────────────────���────────────────────────────────────────
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
const COMM_TABS: SysTab[] = [
  { id: "smtp",          label: "Email / SMTP",   icon: Server       },
  { id: "sms",           label: "SMS",            icon: Smartphone   },
  { id: "whatsapp",      label: "WhatsApp",       icon: WhatsAppIcon },
  { id: "notifications", label: "Notificaciones", icon: Bell         },
];

// ── Tipos Remitentes/SMTP ──────────────────────────────────────────────────
interface SmtpServer {
  id: string; name: string; host: string; port: string;
  security: "tls" | "ssl" | "none"; user: string; password: string;
}
interface MailSender {
  id: string; alias: string; fromName: string; fromEmail: string;
  purpose: string; smtpId: string;
}
const PURPOSES = [
  "Envío de RIDE (Factura electrónica)",
  "Envío de Comprobantes de Retención",
  "Envío de Notas de Crédito",
  "Envío de Notas de Débito",
  "Envío de Guías de Remisión",
  "Notificaciones al cliente",
  "Notificaciones internas",
  "Recuperación de contraseña",
  "Otro",
];

// ── Componente principal ──────────────────────────────────────────────────────
export function CommunicationsContent() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("smtp");

  // ── SMTP multi-servidor ──
  const [smtpServers, setSmtpServers] = useState<SmtpServer[]>([
    { id: "1", name: "Gmail Corporativo", host: "smtp.gmail.com", port: "587", security: "tls", user: "notificaciones@empresa.com", password: "" },
  ]);
  const [smtpExpanded,   setSmtpExpanded]   = useState<string|null>(null);
  const [smtpForm,       setSmtpForm]       = useState<SmtpServer|null>(null);
  const [smtpShowPwd,    setSmtpShowPwd]    = useState(false);
  const [smtpTesting,    setSmtpTesting]    = useState(false);
  const [smtpTestResult, setSmtpTestResult] = useState<Record<string,"ok"|"fail">>({});
  const [showSmtpNew,    setShowSmtpNew]    = useState(false);

  // ── Remitentes ──
  const [mailSenders, setMailSenders] = useState<MailSender[]>([
    { id: "1", alias: "Facturación RIDE",  fromName: "TicSoftEc", fromEmail: "facturacion@empresa.com", purpose: "Envío de RIDE (Factura electrónica)", smtpId: "1" },
    { id: "2", alias: "Notificaciones",    fromName: "TicSoftEc", fromEmail: "notificaciones@empresa.com", purpose: "Notificaciones al cliente",          smtpId: "1" },
  ]);
  const [senderExpanded, setSenderExpanded] = useState<string|null>(null);
  const [senderForm,     setSenderForm]     = useState<MailSender|null>(null);
  const [showSenderNew,  setShowSenderNew]  = useState(false);

  const newSmtp   = (): SmtpServer => ({ id: Date.now().toString(), name: "", host: "", port: "587", security: "tls", user: "", password: "" });
  const newSender = (): MailSender => ({ id: Date.now().toString(), alias: "", fromName: "", fromEmail: "", purpose: PURPOSES[0], smtpId: smtpServers[0]?.id ?? "" });

  const saveSmtp = () => {
    if (!smtpForm) return;
    setSmtpServers(p => p.some(s => s.id === smtpForm.id) ? p.map(s => s.id === smtpForm.id ? smtpForm : s) : [...p, smtpForm]);
    setSmtpForm(null); setSmtpExpanded(null); setShowSmtpNew(false);
  };
  const saveSender = () => {
    if (!senderForm) return;
    setMailSenders(p => p.some(s => s.id === senderForm.id) ? p.map(s => s.id === senderForm.id ? senderForm : s) : [...p, senderForm]);
    setSenderForm(null); setSenderExpanded(null); setShowSenderNew(false);
  };
  const testSmtp = (id: string) => {
    setSmtpTesting(true);
    setTimeout(() => { setSmtpTestResult(p => ({ ...p, [id]: Math.random() > 0.2 ? "ok" : "fail" })); setSmtpTesting(false); }, 1800);
  };

  // SMS
  const [smsProvider,    setSmsProvider]    = useState("twilio");
  const [smsAccountSid,  setSmsAccountSid]  = useState("");
  const [smsAuthToken,   setSmsAuthToken]   = useState("");
  const [smsFromNumber,  setSmsFromNumber]  = useState("");
  const [smsEnabled,     setSmsEnabled]     = useState(false);
  const [testPhone,      setTestPhone]      = useState("");

  // WhatsApp
  const [waProvider,    setWaProvider]    = useState("twilio");
  const [waApiKey,      setWaApiKey]      = useState("");
  const [waPhoneId,     setWaPhoneId]     = useState("");
  const [waBusinessId,  setWaBusinessId]  = useState("");
  const [waEnabled,     setWaEnabled]     = useState(false);
  const [testWa,        setTestWa]        = useState("");

  const isLight = theme === "light";
  const txt  = isLight ? "text-gray-900" : "text-white";
  const sub  = isLight ? "text-gray-500" : "text-gray-400";
  const lbl  = isLight ? "text-gray-600" : "text-gray-300";
  const divB = isLight ? "border-gray-200" : "border-white/10";
  const card = `rounded-xl p-5 border ${isLight ? "bg-white border-gray-200 shadow-sm" : "bg-white/5 border-white/10"}`;
  const IN   = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400" : "bg-[#0f1825] border-white/10 text-white placeholder-gray-500"}`;
  const INd  = `${IN} disabled:opacity-50 disabled:cursor-not-allowed`;
  const OB   = isLight ? "" : "bg-[#0D1B2A]";
  const btnSec = isLight
    ? "px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
    : "px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50";

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <div className="relative flex-shrink-0 cursor-pointer" onClick={() => onChange(!checked)}>
      <div className={`w-11 h-6 rounded-full transition-colors ${checked ? "bg-primary" : isLight ? "bg-gray-300" : "bg-white/10"}`}>
        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 w-full">

      <div className={`border-t ${divB}`} />

      <div className="flex justify-end">
        <button
          onClick={() => toast.success("Configuración guardada exitosamente")}
          className="inline-flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20"
        >
          Guardar Cambios
        </button>
      </div>

      <SysTabBar tabs={COMM_TABS} active={activeTab} onChange={setActiveTab} />

      {/* ── SMTP ── */}
      {activeTab === "smtp" && (
        <div className="space-y-5">

          {/* ── Servidores SMTP ── */}
          <div className={card}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
                  <Server className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className={`font-bold text-base ${txt}`}>Servidores SMTP</h3>
                  <p className={`text-xs ${sub}`}>Servidores de salida de correo electrónico</p>
                </div>
              </div>
              <button type="button" onClick={() => { setSmtpForm(newSmtp()); setShowSmtpNew(true); setSmtpExpanded(null); }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-primary hover:bg-primary/90 text-white transition-all shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" /> Nuevo SMTP
              </button>
            </div>

            {showSmtpNew && smtpForm && (
              <div className={`rounded-xl border p-4 mb-4 ${isLight ? "border-primary/20 bg-primary/5" : "border-primary/20 bg-primary/5"}`}>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-3 text-primary`}>Nuevo servidor SMTP</p>
                <SmtpInlineForm form={smtpForm} setForm={setSmtpForm} IN={IN} OB={OB} isLight={isLight}
                  showPwd={smtpShowPwd} setShowPwd={setSmtpShowPwd} onSave={saveSmtp}
                  onCancel={() => { setShowSmtpNew(false); setSmtpForm(null); }} />
              </div>
            )}

            <div className="space-y-2">
              {smtpServers.map(server => (
                <div key={server.id} className={`rounded-xl border ${isLight ? "border-gray-200" : "border-white/10"}`}>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isLight ? "bg-blue-50" : "bg-blue-500/10"}`}>
                      <Server className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${txt}`}>{server.name || "Sin nombre"}</p>
                      <p className={`text-xs ${sub} truncate`}>{server.host}:{server.port} · {server.security.toUpperCase()} · {server.user}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {smtpTestResult[server.id] && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${smtpTestResult[server.id] === "ok" ? isLight ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-300" : isLight ? "bg-red-100 text-red-700" : "bg-red-500/20 text-red-300"}`}>
                          {smtpTestResult[server.id] === "ok" ? "✓ OK" : "✗ Falló"}
                        </span>
                      )}
                      <button type="button" onClick={() => testSmtp(server.id)} disabled={smtpTesting} className={btnSec}>
                        {smtpTesting ? "..." : "Probar"}
                      </button>
                      <button type="button" onClick={() => { setSmtpForm({ ...server }); setSmtpExpanded(smtpExpanded === server.id ? null : server.id); setShowSmtpNew(false); }} className={btnSec}>
                        {smtpExpanded === server.id ? <ChevronUp className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                      </button>
                      <button type="button" onClick={() => setSmtpServers(p => p.filter(s => s.id !== server.id))}
                        className={`px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${isLight ? "border-gray-200 hover:border-red-300 hover:text-red-600 text-gray-600" : "border-white/10 hover:border-red-500/50 hover:text-red-400 text-gray-400"}`}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {smtpExpanded === server.id && smtpForm && (
                    <div className={`border-t px-4 pb-4 pt-3 ${isLight ? "border-gray-100 bg-gray-50/50" : "border-white/5 bg-white/[0.02]"}`}>
                      <SmtpInlineForm form={smtpForm} setForm={setSmtpForm} IN={IN} OB={OB} isLight={isLight}
                        showPwd={smtpShowPwd} setShowPwd={setSmtpShowPwd} onSave={saveSmtp}
                        onCancel={() => { setSmtpExpanded(null); setSmtpForm(null); }} />
                    </div>
                  )}
                </div>
              ))}
              {smtpServers.length === 0 && <p className={`text-center py-6 text-sm ${sub}`}>No hay servidores SMTP configurados.</p>}
            </div>
          </div>

          {/* ── Remitentes ── */}
          <div className={card}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
                  <Send className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className={`font-bold text-base ${txt}`}>Remitentes de Correo</h3>
                  <p className={`text-xs ${sub}`}>Cada remitente usa un SMTP y tiene un propósito específico</p>
                </div>
              </div>
              <button type="button" onClick={() => { setSenderForm(newSender()); setShowSenderNew(true); setSenderExpanded(null); }}
                disabled={smtpServers.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-primary hover:bg-primary/90 text-white transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed">
                <Plus className="w-4 h-4" /> Nuevo Remitente
              </button>
            </div>

            {smtpServers.length === 0 && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border mb-3 ${isLight ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-amber-500/10 border-amber-500/30 text-amber-300"}`}>
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <p className="text-xs">Configura al menos un servidor SMTP antes de crear remitentes.</p>
              </div>
            )}

            {showSenderNew && senderForm && (
              <div className={`rounded-xl border p-4 mb-4 ${isLight ? "border-primary/20 bg-primary/5" : "border-primary/20 bg-primary/5"}`}>
                <p className="text-xs font-semibold uppercase tracking-wide mb-3 text-primary">Nuevo remitente</p>
                <SenderInlineForm form={senderForm} setForm={setSenderForm} smtpServers={smtpServers} IN={IN} OB={OB} isLight={isLight}
                  onSave={saveSender} onCancel={() => { setShowSenderNew(false); setSenderForm(null); }} />
              </div>
            )}

            <div className="space-y-2">
              {mailSenders.map(sender => {
                const smtp = smtpServers.find(s => s.id === sender.smtpId);
                return (
                  <div key={sender.id} className={`rounded-xl border ${isLight ? "border-gray-200" : "border-white/10"}`}>
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isLight ? "bg-orange-50" : "bg-primary/10"}`}>
                        <Mail className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-sm font-semibold ${txt}`}>{sender.alias}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${isLight ? "bg-gray-100 text-gray-500" : "bg-white/10 text-gray-400"}`}>
                            {smtp?.name ?? "Sin SMTP"}
                          </span>
                        </div>
                        <p className={`text-xs ${sub} truncate`}>{sender.fromName} &lt;{sender.fromEmail}&gt;</p>
                        <p className="text-[11px] mt-0.5 text-primary/80">{sender.purpose}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button type="button" onClick={() => { setSenderForm({ ...sender }); setSenderExpanded(senderExpanded === sender.id ? null : sender.id); setShowSenderNew(false); }} className={btnSec}>
                          {senderExpanded === sender.id ? <ChevronUp className="w-3.5 h-3.5" /> : <Pencil className="w-3.5 h-3.5" />}
                        </button>
                        <button type="button" onClick={() => setMailSenders(p => p.filter(s => s.id !== sender.id))}
                          className={`px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${isLight ? "border-gray-200 hover:border-red-300 hover:text-red-600 text-gray-600" : "border-white/10 hover:border-red-500/50 hover:text-red-400 text-gray-400"}`}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {senderExpanded === sender.id && senderForm && (
                      <div className={`border-t px-4 pb-4 pt-3 ${isLight ? "border-gray-100 bg-gray-50/50" : "border-white/5 bg-white/[0.02]"}`}>
                        <SenderInlineForm form={senderForm} setForm={setSenderForm} smtpServers={smtpServers} IN={IN} OB={OB} isLight={isLight}
                          onSave={saveSender} onCancel={() => { setSenderExpanded(null); setSenderForm(null); }} />
                      </div>
                    )}
                  </div>
                );
              })}
              {mailSenders.length === 0 && <p className={`text-center py-6 text-sm ${sub}`}>No hay remitentes configurados.</p>}
            </div>
          </div>
        </div>
      )}

      {/* ── SMS ── */}
      {activeTab === "sms" && (
        <div className={card}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-primary" />
            </div>
            <h3 className={`font-bold text-base ${txt}`}>Configuración de SMS</h3>
            <div className="ml-auto flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <span className={`text-sm ${lbl}`}>Habilitado</span>
                <Toggle checked={smsEnabled} onChange={setSmsEnabled} />
              </label>
              <button onClick={() => toast.info("Enviando SMS de prueba...")} disabled={!smsEnabled} className={btnSec}>Probar SMS</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Proveedor">
              <select value={smsProvider} onChange={e => setSmsProvider(e.target.value)} disabled={!smsEnabled} className={INd}>
                <option value="twilio" className={OB}>Twilio</option>
                <option value="aws-sns" className={OB}>AWS SNS</option>
                <option value="nexmo" className={OB}>Nexmo</option>
              </select>
            </Field>
            <Field label="Account SID"><input type="text" value={smsAccountSid} onChange={e => setSmsAccountSid(e.target.value)} disabled={!smsEnabled} className={INd} /></Field>
            <Field label="Auth Token"><input type="password" value={smsAuthToken} onChange={e => setSmsAuthToken(e.target.value)} disabled={!smsEnabled} className={INd} /></Field>
            <Field label="Número de origen"><input type="text" value={smsFromNumber} onChange={e => setSmsFromNumber(e.target.value)} disabled={!smsEnabled} placeholder="+1234567890" className={INd} /></Field>
            <Field label="Teléfono de prueba"><input type="text" value={testPhone} onChange={e => setTestPhone(e.target.value)} disabled={!smsEnabled} placeholder="+593999999999" className={INd} /></Field>
          </div>
        </div>
      )}

      {/* ── WhatsApp ── */}
      {activeTab === "whatsapp" && (
        <div className={card}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
              <WhatsAppIcon className="w-4 h-4 text-primary" />
            </div>
            <h3 className={`font-bold text-base ${txt}`}>Configuración de WhatsApp</h3>
            <div className="ml-auto flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <span className={`text-sm ${lbl}`}>Habilitado</span>
                <Toggle checked={waEnabled} onChange={setWaEnabled} />
              </label>
              <button onClick={() => toast.info("Enviando WhatsApp de prueba...")} disabled={!waEnabled} className={btnSec}>Probar WhatsApp</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Proveedor">
              <select value={waProvider} onChange={e => setWaProvider(e.target.value)} disabled={!waEnabled} className={INd}>
                <option value="twilio" className={OB}>Twilio</option>
                <option value="whatsapp-business" className={OB}>WhatsApp Business API</option>
                <option value="360dialog" className={OB}>360Dialog</option>
              </select>
            </Field>
            <Field label="API Key"><input type="password" value={waApiKey} onChange={e => setWaApiKey(e.target.value)} disabled={!waEnabled} className={INd} /></Field>
            <Field label="Phone Number ID"><input type="text" value={waPhoneId} onChange={e => setWaPhoneId(e.target.value)} disabled={!waEnabled} className={INd} /></Field>
            <Field label="Business Account ID"><input type="text" value={waBusinessId} onChange={e => setWaBusinessId(e.target.value)} disabled={!waEnabled} className={INd} /></Field>
            <Field label="Número de prueba"><input type="text" value={testWa} onChange={e => setTestWa(e.target.value)} disabled={!waEnabled} placeholder="+593999999999" className={INd} /></Field>
          </div>
        </div>
      )}

      {/* ── Notificaciones por Rol ── */}
      {activeTab === "notifications" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className={`font-bold text-base ${txt}`}>Notificaciones por Rol</h3>
              <p className={`text-xs ${sub}`}>
                Los roles se sincronizan desde <strong>Configuración → Roles y Permisos</strong>
              </p>
            </div>
          </div>
          <NotificationsByRole />
        </div>
      )}
    </div>
  );
}

// ── Formularios Inline ──────────────────────────────────────────────────────
function SmtpInlineForm({ form, setForm, IN, OB, isLight, showPwd, setShowPwd, onSave, onCancel }: {
  form: SmtpServer;
  setForm: (v: SmtpServer) => void;
  IN: string;
  OB: string;
  isLight: boolean;
  showPwd: boolean;
  setShowPwd: (v: boolean) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Nombre del servidor">
        <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={IN} placeholder="Gmail Corporativo" />
      </Field>
      <Field label="Servidor SMTP">
        <input type="text" value={form.host} onChange={e => setForm({ ...form, host: e.target.value })} className={IN} placeholder="smtp.gmail.com" />
      </Field>
      <Field label="Puerto">
        <input type="text" value={form.port} onChange={e => setForm({ ...form, port: e.target.value })} className={IN} placeholder="587" />
      </Field>
      <Field label="Cifrado">
        <select value={form.security} onChange={e => setForm({ ...form, security: e.target.value as "tls" | "ssl" | "none" })} className={IN}>
          <option value="tls" className={OB}>TLS</option>
          <option value="ssl" className={OB}>SSL</option>
          <option value="none" className={OB}>Ninguno</option>
        </select>
      </Field>
      <Field label="Usuario">
        <input type="text" value={form.user} onChange={e => setForm({ ...form, user: e.target.value })} className={IN} />
      </Field>
      <Field label="Contraseña">
        <div className="relative">
          <input type={showPwd ? "text" : "password"} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className={IN} />
          <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute top-0 right-0 px-3 py-2 text-sm text-gray-500 hover:text-gray-700">
            {showPwd ? <X className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
          </button>
        </div>
      </Field>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onSave} className="inline-flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20">
          <Check className="w-4 h-4" /> Guardar
        </button>
        <button type="button" onClick={onCancel} className="inline-flex items-center gap-2 px-5 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors">
          <X className="w-4 h-4" /> Cancelar
        </button>
      </div>
    </div>
  );
}

function SenderInlineForm({ form, setForm, smtpServers, IN, OB, isLight, onSave, onCancel }: {
  form: MailSender;
  setForm: (v: MailSender) => void;
  smtpServers: SmtpServer[];
  IN: string;
  OB: string;
  isLight: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Alias">
        <input type="text" value={form.alias} onChange={e => setForm({ ...form, alias: e.target.value })} className={IN} placeholder="Facturación RIDE" />
      </Field>
      <Field label="Nombre del remitente">
        <input type="text" value={form.fromName} onChange={e => setForm({ ...form, fromName: e.target.value })} className={IN} placeholder="TicSoftEc" />
      </Field>
      <Field label="Email del remitente">
        <input type="email" value={form.fromEmail} onChange={e => setForm({ ...form, fromEmail: e.target.value })} className={IN} placeholder="facturacion@empresa.com" />
      </Field>
      <Field label="Propósito">
        <select value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} className={IN}>
          {PURPOSES.map(p => <option key={p} value={p} className={OB}>{p}</option>)}
        </select>
      </Field>
      <Field label="Servidor SMTP">
        <select value={form.smtpId} onChange={e => setForm({ ...form, smtpId: e.target.value })} className={IN}>
          {smtpServers.map(s => <option key={s.id} value={s.id} className={OB}>{s.name}</option>)}
        </select>
      </Field>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onSave} className="inline-flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20">
          <Check className="w-4 h-4" /> Guardar
        </button>
        <button type="button" onClick={onCancel} className="inline-flex items-center gap-2 px-5 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors">
          <X className="w-4 h-4" /> Cancelar
        </button>
      </div>
    </div>
  );
}