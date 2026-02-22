import { useState } from "react";
import { Mail, Bell, MessageSquare } from "lucide-react";

interface CommunicationsContentProps {}

export function CommunicationsContent(_props: CommunicationsContentProps) {
  const [activeTab, setActiveTab] = useState("smtp");
  
  // Estados para SMTP
  const [smtpHost, setSmtpHost] = useState("smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUsername, setSmtpUsername] = useState("notificaciones@ticsoftec.com");
  const [smtpPassword, setSmtpPassword] = useState("");
  const [smtpEncryption, setSmtpEncryption] = useState("TLS");
  const [smtpFromName, setSmtpFromName] = useState("TicSoftEc");
  const [smtpFromEmail, setSmtpFromEmail] = useState("notificaciones@ticsoftec.com");

  // Estados para SMS
  const [smsProvider, setSmsProvider] = useState("twilio");
  const [smsAccountSid, setSmsAccountSid] = useState("");
  const [smsAuthToken, setSmsAuthToken] = useState("");
  const [smsFromNumber, setSmsFromNumber] = useState("");
  const [smsEnabled, setSmsEnabled] = useState(false);

  // Estados para WhatsApp
  const [whatsappProvider, setWhatsappProvider] = useState("twilio");
  const [whatsappApiKey, setWhatsappApiKey] = useState("");
  const [whatsappPhoneId, setWhatsappPhoneId] = useState("");
  const [whatsappBusinessId, setWhatsappBusinessId] = useState("");
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);

  // Estado de prueba
  const [testEmail, setTestEmail] = useState("");
  const [testPhone, setTestPhone] = useState("");
  const [testWhatsapp, setTestWhatsapp] = useState("");

  // Estados para notificaciones del sistema
  const [systemUpdates, setSystemUpdates] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [maintenanceNotices, setMaintenanceNotices] = useState(true);
  const [newFeatures, setNewFeatures] = useState(false);

  // Estados para notificaciones de la aplicación
  const [newInvoice, setNewInvoice] = useState(true);
  const [paymentReceived, setPaymentReceived] = useState(true);
  const [inventoryLowStock, setInventoryLowStock] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Estados para canales de notificación
  const [emailNotifEnabled, setEmailNotifEnabled] = useState(true);
  const [smsNotifEnabled, setSmsNotifEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [inAppEnabled, setInAppEnabled] = useState(true);

  // Estados para preferencias
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [quietHoursStart, setQuietHoursStart] = useState("22:00");
  const [quietHoursEnd, setQuietHoursEnd] = useState("08:00");

  const handleTestSMTP = () => {
    alert("Probando conexión SMTP...");
  };

  const handleSaveSMTP = () => {
    console.log("Guardando configuración SMTP...");
    alert("Configuración SMTP guardada");
  };

  const handleTestSMS = () => {
    alert("Enviando SMS de prueba...");
  };

  const handleSaveSMS = () => {
    console.log("Guardando configuración SMS...");
    alert("Configuración SMS guardada");
  };

  const handleTestWhatsApp = () => {
    alert("Enviando mensaje de prueba por WhatsApp...");
  };

  const handleSaveWhatsApp = () => {
    console.log("Guardando configuración WhatsApp...");
    alert("Configuración WhatsApp guardada");
  };

  const handleSaveNotifications = () => {
    console.log("Guardando preferencias de notificaciones...");
    alert("Preferencias de notificaciones guardadas");
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header con título */}
      <div>
        <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-primary" />
          Configuración de Comunicaciones y Notificaciones
        </h2>
        <p className="text-gray-400 text-sm">
          Configuración de canales de comunicación y sistema de notificaciones
        </p>
      </div>

      <div className="border-t border-white/10"></div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-white/10 overflow-x-auto">
        <button
          onClick={() => setActiveTab("smtp")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-medium ${
            activeTab === "smtp"
              ? "bg-primary text-white"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <Mail className="w-4 h-4" />
          Email / SMTP
        </button>
        <button
          onClick={() => setActiveTab("sms")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-medium ${
            activeTab === "sms"
              ? "bg-primary text-white"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          SMS
        </button>
        <button
          onClick={() => setActiveTab("whatsapp")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-medium ${
            activeTab === "whatsapp"
              ? "bg-primary text-white"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          WhatsApp
        </button>
        
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "smtp" && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <h3 className="text-white font-bold text-lg">Servidor SMTP (Email)</h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleTestSMTP}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-colors text-sm font-medium"
                >
                  Probar Conexión
                </button>
                <button
                  onClick={handleSaveSMTP}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors text-sm font-medium"
                >
                  Guardar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Servidor SMTP
                </label>
                <input
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="smtp.gmail.com"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Puerto
                </label>
                <input
                  type="text"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="587"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Usuario
                </label>
                <input
                  type="text"
                  value={smtpUsername}
                  onChange={(e) => setSmtpUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={smtpPassword}
                  onChange={(e) => setSmtpPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Cifrado
                </label>
                <select
                  value={smtpEncryption}
                  onChange={(e) => setSmtpEncryption(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="TLS">TLS</option>
                  <option value="SSL">SSL</option>
                  <option value="none">Ninguno</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Email de prueba
                </label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  placeholder="test@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Nombre del remitente
                </label>
                <input
                  type="text"
                  value={smtpFromName}
                  onChange={(e) => setSmtpFromName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Email del remitente
                </label>
                <input
                  type="email"
                  value={smtpFromEmail}
                  onChange={(e) => setSmtpFromEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "sms" && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <h3 className="text-white font-bold text-lg">Configuración de SMS</h3>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-gray-300 text-sm">Habilitado</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={smsEnabled}
                      onChange={(e) => setSmsEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 rounded-full peer-checked:bg-primary transition-colors">
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${smsEnabled ? 'translate-x-5' : ''}`}></div>
                    </div>
                  </div>
                </label>
                <button
                  onClick={handleTestSMS}
                  disabled={!smsEnabled}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-colors text-sm font-medium disabled:opacity-50"
                >
                  Probar SMS
                </button>
                <button
                  onClick={handleSaveSMS}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors text-sm font-medium"
                >
                  Guardar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Proveedor
                </label>
                <select
                  value={smsProvider}
                  onChange={(e) => setSmsProvider(e.target.value)}
                  disabled={!smsEnabled}
                  className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                >
                  <option value="twilio">Twilio</option>
                  <option value="aws-sns">AWS SNS</option>
                  <option value="nexmo">Nexmo</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Account SID
                </label>
                <input
                  type="text"
                  value={smsAccountSid}
                  onChange={(e) => setSmsAccountSid(e.target.value)}
                  disabled={!smsEnabled}
                  className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Auth Token
                </label>
                <input
                  type="password"
                  value={smsAuthToken}
                  onChange={(e) => setSmsAuthToken(e.target.value)}
                  disabled={!smsEnabled}
                  className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Número de origen
                </label>
                <input
                  type="text"
                  value={smsFromNumber}
                  onChange={(e) => setSmsFromNumber(e.target.value)}
                  disabled={!smsEnabled}
                  placeholder="+1234567890"
                  className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Teléfono de prueba
                </label>
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  disabled={!smsEnabled}
                  placeholder="+593999999999"
                  className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "whatsapp" && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <h3 className="text-white font-bold text-lg">Configuración de WhatsApp</h3>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-gray-300 text-sm">Habilitado</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={whatsappEnabled}
                      onChange={(e) => setWhatsappEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/10 rounded-full peer-checked:bg-primary transition-colors">
                      <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${whatsappEnabled ? 'translate-x-5' : ''}`}></div>
                    </div>
                  </div>
                </label>
                <button
                  onClick={handleTestWhatsApp}
                  disabled={!whatsappEnabled}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-colors text-sm font-medium disabled:opacity-50"
                >
                  Probar WhatsApp
                </button>
                <button
                  onClick={handleSaveWhatsApp}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors text-sm font-medium"
                >
                  Guardar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Proveedor
                </label>
                <select
                  value={whatsappProvider}
                  onChange={(e) => setWhatsappProvider(e.target.value)}
                  disabled={!whatsappEnabled}
                  className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                >
                  <option value="twilio">Twilio</option>
                  <option value="whatsapp-business">WhatsApp Business API</option>
                  <option value="360dialog">360Dialog</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  API Key
                </label>
                <input
                  type="password"
                  value={whatsappApiKey}
                  onChange={(e) => setWhatsappApiKey(e.target.value)}
                  disabled={!whatsappEnabled}
                  className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Phone Number ID
                </label>
                <input
                  type="text"
                  value={whatsappPhoneId}
                  onChange={(e) => setWhatsappPhoneId(e.target.value)}
                  disabled={!whatsappEnabled}
                  className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Business Account ID
                </label>
                <input
                  type="text"
                  value={whatsappBusinessId}
                  onChange={(e) => setWhatsappBusinessId(e.target.value)}
                  disabled={!whatsappEnabled}
                  className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2 font-medium">
                  Número de prueba
                </label>
                <input
                  type="text"
                  value={testWhatsapp}
                  onChange={(e) => setTestWhatsapp(e.target.value)}
                  disabled={!whatsappEnabled}
                  placeholder="+593999999999"
                  className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <h3 className="text-white font-bold text-lg">Preferencias de Notificaciones</h3>
                </div>
                <button
                  onClick={handleSaveNotifications}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors text-sm font-medium"
                >
                  Guardar Preferencias
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-medium mb-4">Notificaciones del Sistema</h4>
                  <div className="space-y-3">
                    {[
                      { label: "Actualizaciones del sistema", value: systemUpdates, setter: setSystemUpdates },
                      { label: "Alertas de seguridad", value: securityAlerts, setter: setSecurityAlerts },
                      { label: "Avisos de mantenimiento", value: maintenanceNotices, setter: setMaintenanceNotices },
                      { label: "Nuevas funcionalidades", value: newFeatures, setter: setNewFeatures },
                    ].map((item, index) => (
                      <label key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                        <span className="text-gray-300">{item.label}</span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={item.value}
                            onChange={(e) => item.setter(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-white/10 rounded-full peer-checked:bg-primary transition-colors">
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${item.value ? 'translate-x-5' : ''}`}></div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-4">Notificaciones de la Aplicación</h4>
                  <div className="space-y-3">
                    {[
                      { label: "Nueva factura generada", value: newInvoice, setter: setNewInvoice },
                      { label: "Pago recibido", value: paymentReceived, setter: setPaymentReceived },
                      { label: "Inventario bajo", value: inventoryLowStock, setter: setInventoryLowStock },
                      { label: "Recordatorios de tareas", value: taskReminders, setter: setTaskReminders },
                      { label: "Reporte generado", value: reportGenerated, setter: setReportGenerated },
                    ].map((item, index) => (
                      <label key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                        <span className="text-gray-300">{item.label}</span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={item.value}
                            onChange={(e) => item.setter(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-white/10 rounded-full peer-checked:bg-primary transition-colors">
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${item.value ? 'translate-x-5' : ''}`}></div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-4">Canales de Notificación</h4>
                  <div className="space-y-3">
                    {[
                      { label: "Email", value: emailNotifEnabled, setter: setEmailNotifEnabled },
                      { label: "SMS", value: smsNotifEnabled, setter: setSmsNotifEnabled },
                      { label: "Push", value: pushEnabled, setter: setPushEnabled },
                      { label: "In-App", value: inAppEnabled, setter: setInAppEnabled },
                    ].map((item, index) => (
                      <label key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                        <span className="text-gray-300">{item.label}</span>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={item.value}
                            onChange={(e) => item.setter(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-white/10 rounded-full peer-checked:bg-primary transition-colors">
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${item.value ? 'translate-x-5' : ''}`}></div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-white font-medium mb-4">Horario Silencioso</h4>
                  <label className="flex items-center justify-between p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors mb-4">
                    <span className="text-gray-300">No molestar</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={doNotDisturb}
                        onChange={(e) => setDoNotDisturb(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-white/10 rounded-full peer-checked:bg-primary transition-colors">
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${doNotDisturb ? 'translate-x-5' : ''}`}></div>
                      </div>
                    </div>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm mb-2 font-medium">
                        Desde
                      </label>
                      <input
                        type="time"
                        value={quietHoursStart}
                        onChange={(e) => setQuietHoursStart(e.target.value)}
                        disabled={!doNotDisturb}
                        className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-2 font-medium">
                        Hasta
                      </label>
                      <input
                        type="time"
                        value={quietHoursEnd}
                        onChange={(e) => setQuietHoursEnd(e.target.value)}
                        disabled={!doNotDisturb}
                        className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}