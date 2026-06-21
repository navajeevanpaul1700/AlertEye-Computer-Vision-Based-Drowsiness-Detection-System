"use client";

import React, { useState } from "react";
import { 
  Volume2, 
  Settings2, 
  Bell, 
  ShieldAlert, 
  Smartphone, 
  Eye, 
  Play,
  Save,
  CheckCircle2
} from "lucide-react";

export default function SettingsPage() {
  const [sensitivity, setSensitivity] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [alarmSound, setAlarmSound] = useState<'Beep' | 'Car Horn' | 'Voice Alert'>('Voice Alert');
  const [volume, setVolume] = useState(80);
  const [faceMesh, setFaceMesh] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight">Configuration</h1>
        <p className="text-text-muted mt-2">Customize BlinkSafe's detection thresholds and alerts to your preference.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Detection Settings */}
        <div className="md:col-span-7 space-y-8">
          
          <div className="bg-surface-1 rounded-2xl border border-surface-2 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-surface-2 pb-4">
              <div className="p-2 bg-accent/10 rounded-lg text-accent"><Settings2 size={24} /></div>
              <h2 className="text-xl font-bold">Detection Sensitivity</h2>
            </div>
            
            <p className="text-sm text-text-muted mb-4">Adjust how aggressively the AI monitors your Eye Aspect Ratio (EAR) and head pose. Lower sensitivity means fewer false alarms but slower detection.</p>
            
            {/* Segmented Control */}
            <div className="flex bg-surface-2 p-1 rounded-xl mb-6">
              {['Low', 'Medium', 'High'].map((level) => (
                <button
                  key={level}
                  onClick={() => setSensitivity(level as any)}
                  className={`flex-1 py-3 text-sm font-semibold rounded-lg transition-all ${
                    sensitivity === level 
                      ? 'bg-surface-1 text-accent shadow-sm ring-1 ring-surface-2/50' 
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            
            <div className="bg-surface-2/30 rounded-lg p-4 text-sm text-text-muted border border-surface-2/50">
              {sensitivity === 'Low' && (
                <p><span className="text-accent font-bold">Low Sensitivity:</span> EAR threshold set to 0.15. Triggers only after 3 consecutive seconds of complete eye closure. Best for drivers wearing heavy glasses or in uneven lighting conditions.</p>
              )}
              {sensitivity === 'Medium' && (
                <p><span className="text-accent font-bold">Medium Sensitivity:</span> EAR threshold set to 0.20. Triggers after 1.5 seconds of eye closure or moderate head nodding. Recommended for most conditions.</p>
              )}
              {sensitivity === 'High' && (
                <p><span className="text-accent font-bold">High Sensitivity:</span> EAR threshold set to 0.25. Instant triggers on micro-sleeps (0.5s duration) and minor head tilts. Best for late night driving when severely fatigued.</p>
              )}
            </div>
          </div>

          <div className="bg-surface-1 rounded-2xl border border-surface-2 p-6 shadow-sm">
             <div className="flex items-center gap-3 mb-6 border-b border-surface-2 pb-4">
              <div className="p-2 bg-accent/10 rounded-lg text-accent"><Eye size={24} /></div>
              <h2 className="text-xl font-bold">Display Preferences</h2>
            </div>

            {/* Toggle Row */}
            <div className="flex items-center justify-between py-2">
              <div>
                <h3 className="font-semibold text-text-primary">Face Mesh Overlay</h3>
                <p className="text-sm text-text-muted mt-1">Show AI landmark tracking dots over the webcam feed</p>
              </div>
              
              {/* Toggle component */}
              <button 
                onClick={() => setFaceMesh(!faceMesh)}
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary ${faceMesh ? 'bg-accent' : 'bg-surface-2'}`}
              >
                <div className={`pointer-events-none absolute h-5 w-5 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center ${faceMesh ? 'translate-x-8' : 'translate-x-1'}`}>
                  {faceMesh && <div className="w-1.5 h-1.5 bg-accent rounded-full" />}
                </div>
              </button>
            </div>
          </div>

        </div>

        {/* Alarm Settings */}
        <div className="md:col-span-5 space-y-8">
          
          <div className="bg-surface-1 rounded-2xl border border-surface-2 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b border-surface-2 pb-4">
              <div className="p-2 bg-danger/10 rounded-lg text-danger"><Bell size={24} /></div>
              <h2 className="text-xl font-bold">Alarm System</h2>
            </div>
            
            <div className="space-y-4 mb-8">
              <h3 className="text-sm font-semibold text-text-muted tracking-wider uppercase">Alarm Sound</h3>
              
              {/* Radio Cards */}
              <div className="space-y-3">
                {[
                  { id: 'Beep', label: 'Standard Beep', desc: 'Loud repetitive digital beep' },
                  { id: 'Car Horn', label: 'Car Horn', desc: 'Aggressive street horn sound' },
                  { id: 'Voice Alert', label: 'Voice Alert', desc: '"Wake up! Danger detected!"' }
                ].map((sound) => (
                  <label 
                    key={sound.id} 
                    className={`relative flex items-center justify-between p-4 cursor-pointer rounded-xl border-2 transition-all ${
                      alarmSound === sound.id 
                        ? 'border-accent bg-accent/5' 
                        : 'border-surface-2 bg-surface-1 hover:border-surface-2/80'
                    }`}
                  >
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        name="alarmSound"
                        value={sound.id}
                        checked={alarmSound === sound.id}
                        onChange={() => setAlarmSound(sound.id as any)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${alarmSound === sound.id ? 'border-accent' : 'border-text-muted'}`}>
                        {alarmSound === sound.id && <div className="w-2.5 h-2.5 rounded-full bg-accent" />}
                      </div>
                      <div>
                        <div className={`font-semibold ${alarmSound === sound.id ? 'text-accent' : 'text-text-primary'}`}>
                          {sound.label}
                        </div>
                        <div className="text-xs text-text-muted mt-1">{sound.desc}</div>
                      </div>
                    </div>
                    <button 
                      type="button"
                      className="p-2 rounded-full bg-surface-2 text-text-primary hover:bg-accent hover:text-primary transition-colors focus:outline-none"
                      onClick={(e) => {
                        e.preventDefault();
                        // Mock play sound
                      }}
                    >
                      <Play size={16} className="ml-0.5" />
                    </button>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-muted tracking-wider uppercase">Volume Level</h3>
                <span className="font-mono font-bold text-accent">{volume}%</span>
              </div>
              
              <div className="flex items-center gap-4">
                <Volume2 size={20} className="text-text-muted shrink-0" />
                
                {/* Custom Range Slider */}
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-surface-2"
                  style={{
                    background: `linear-gradient(to right, #06B6D4 0%, #06B6D4 ${volume}%, #1F2937 ${volume}%, #1F2937 100%)`
                  }}
                />
                
                <ShieldAlert size={20} className="text-danger shrink-0" />
              </div>
              <p className="text-xs text-text-muted text-center mt-2">Always test volume before driving.</p>
            </div>


            <div className="pt-4 border-t border-surface-2">
               <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-surface-2 rounded-lg text-text-primary"><Smartphone size={20} /></div>
                  <div>
                    <h3 className="font-semibold text-text-primary text-sm">Push Notifications</h3>
                  </div>
                </div>
                <button 
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-300 focus:outline-none ${notifications ? 'bg-accent' : 'bg-surface-2'}`}
                >
                  <div className={`pointer-events-none absolute h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Save Action */}
      <div className="mt-8 pt-6 border-t border-surface-2 flex items-center justify-end">
        {showSuccess && (
          <span className="text-safe flex items-center gap-2 mr-6 animate-in fade-in slide-in-from-right-4">
            <CheckCircle2 size={20} />
            <span className="font-semibold">Settings Saved</span>
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-accent text-primary px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-accent/90 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save size={20} />
              Save Configuration
            </>
          )}
        </button>
      </div>

    </div>
  );
}
