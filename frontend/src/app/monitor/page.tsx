"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Activity, Clock, AlertTriangle, ShieldAlert, VideoOff } from "lucide-react";

const WS_URL = "ws://localhost:8001/ws";
const FRAME_INTERVAL_MS = 150; // ~7 fps — fast enough for detection, light on bandwidth

export default function MonitorPage() {
  const [status, setStatus] = useState<'SAFE' | 'DROWSY' | 'ALERT'>('SAFE');
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [ear, setEar] = useState(0.35);
  const [alertsTriggered, setAlertsTriggered] = useState(0);
  const [eyesClosedEvents, setEyesClosedEvents] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameLoopRef = useRef<number | null>(null);
  const prevStatusRef = useRef<'SAFE' | 'DROWSY' | 'ALERT'>('SAFE');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const alarmIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Alarm sound via Web Audio API ---
  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }, []);

  const playBeep = useCallback((freq: number, durationMs: number) => {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.value = 0.35;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
  }, [getAudioCtx]);

  const stopAlarm = useCallback(() => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
  }, []);

  const startAlarm = useCallback(() => {
    stopAlarm();
    // Play immediately then repeat
    playBeep(880, 200);
    alarmIntervalRef.current = setInterval(() => playBeep(880, 200), 400);
  }, [playBeep, stopAlarm]);

  // Start/stop alarm based on status
  useEffect(() => {
    if (status === "ALERT") {
      startAlarm();
    } else {
      stopAlarm();
    }
    return () => stopAlarm();
  }, [status, startAlarm, stopAlarm]);

  // Track drowsy/alert event transitions (only count when status *changes*)
  useEffect(() => {
    const prev = prevStatusRef.current;
    if (status === 'DROWSY' && prev !== 'DROWSY') {
      setEyesClosedEvents(e => e + 1);
    }
    if (status === 'ALERT' && prev !== 'ALERT') {
      setAlertsTriggered(a => a + 1);
    }
    prevStatusRef.current = status;
  }, [status]);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => setSessionSeconds(s => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Capture a frame from the video and return as base64 JPEG
  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL("image/jpeg", 0.7);
  }, []);

  // Start the frame-sending loop
  const startFrameLoop = useCallback(() => {
    const send = () => {
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        const frame = captureFrame();
        if (frame) ws.send(frame);
      }
      frameLoopRef.current = window.setTimeout(send, FRAME_INTERVAL_MS);
    };
    send();
  }, [captureFrame]);

  // Connect WebSocket
  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    const connect = () => {
      ws = new WebSocket(WS_URL);

      ws.onopen = () => {
        setWsConnected(true);
        wsRef.current = ws;
        startFrameLoop();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.state) setStatus(data.state);
          if (data.ear !== null && data.ear !== undefined) setEar(data.ear);
        } catch {
          // ignore malformed messages
        }
      };

      ws.onclose = () => {
        setWsConnected(false);
        wsRef.current = null;
        if (frameLoopRef.current) clearTimeout(frameLoopRef.current);
        // Reconnect after 2s
        reconnectTimer = setTimeout(connect, 2000);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (frameLoopRef.current) clearTimeout(frameLoopRef.current);
      if (ws) ws.close();
    };
  }, [startFrameLoop]);

  // Start camera
  useEffect(() => {
    let cancelled = false;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: "user" },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraReady(true);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Camera access denied";
        setCameraError(message);
      }
    };

    startCamera();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? hrs.toString().padStart(2, '0') + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusConfig = () => {
    switch(status) {
      case 'SAFE': return { color: 'text-safe', bg: 'bg-safe/20', border: 'border-safe', shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]', label: 'SAFE' };
      case 'DROWSY': return { color: 'text-warning', bg: 'bg-warning/20', border: 'border-warning', shadow: 'shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-pulse', label: 'DROWSY - WAKE UP' };
      case 'ALERT': return { color: 'text-danger', bg: 'bg-danger/20', border: 'border-danger', shadow: 'shadow-[0_0_30px_rgba(239,68,68,0.8)] animate-pulse', label: 'CRITICAL ALERT' };
    }
  };

  const sc = getStatusConfig();
  const threshold = 0.25;
  const earPercentage = Math.min((ear / 0.5) * 100, 100);

  return (
    <div className="absolute inset-0 bg-primary flex flex-col overflow-hidden text-text-primary">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-surface-2 bg-surface-1/50 z-10 shrink-0">
        <Link href="/" className="font-heading text-xl font-bold tracking-tight flex items-center gap-2">
          Blink<span className="text-accent">Safe</span>
        </Link>
        <div className="flex items-center gap-3 bg-surface-2 px-6 py-2 rounded-full border border-surface-2">
          <Clock size={16} className="text-accent" />
          <span className="font-mono text-lg font-medium tracking-wider">{formatTime(sessionSeconds)}</span>
        </div>
        <Link
          href="/"
          className="px-6 py-2 border-2 border-danger text-danger hover:bg-danger hover:text-white rounded-md font-bold transition-colors text-sm"
        >
          END SESSION
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
        {/* Left/Center Area: Feed & Stats */}
        <div className="flex-1 flex flex-col gap-6 h-full">

          {/* Status Badge */}
          <div className="flex justify-center shrink-0">
            <div className={`px-8 py-2 md:py-3 rounded-full border-2 ${sc.border} ${sc.bg} ${sc.shadow} transition-all duration-300 backdrop-blur-sm`}>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full bg-current ${sc.color} ${status !== 'SAFE' ? 'animate-ping' : ''}`} />
                <span className={`font-black tracking-widest text-lg ${sc.color}`}>
                  {sc.label}
                </span>
                <div className={`w-3 h-3 rounded-full bg-current ${sc.color} ${status !== 'SAFE' ? 'animate-ping' : ''}`} />
              </div>
            </div>
          </div>

          {/* Webcam Feed Box */}
          <div className={`relative flex-1 bg-black rounded-2xl border-2 ${status === 'SAFE' ? 'border-accent/30 shadow-[0_0_40px_rgba(6,182,212,0.1)]' : status === 'DROWSY' ? 'border-warning shadow-[0_0_50px_rgba(245,158,11,0.2)]' : 'border-danger shadow-[0_0_50px_rgba(239,68,68,0.4)]'} flex items-center justify-center overflow-hidden transition-all duration-500`}>

            {/* Live video feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />

            {/* Hidden canvas for frame capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Camera error fallback */}
            {cameraError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-1/90 gap-4">
                <VideoOff className="w-16 h-16 text-danger" />
                <p className="text-text-muted text-sm text-center px-8">
                  Camera unavailable: {cameraError}
                </p>
              </div>
            )}

            {/* Alert pulse overlay */}
            <div className={`absolute inset-0 pointer-events-none ${status === 'ALERT' ? 'bg-danger/10 animate-pulse' : ''}`} />

            {/* Top Left Feed Label */}
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-md border border-surface-2 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${cameraReady ? 'bg-safe animate-pulse' : 'bg-danger'}`} />
              <span className="text-xs font-mono font-medium text-text-muted">
                {cameraReady ? 'CAMERA ACTIVE' : 'NO CAMERA'}
              </span>
            </div>

            {/* WebSocket connection indicator */}
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-md border border-surface-2 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-safe' : 'bg-danger animate-pulse'}`} />
              <span className="text-xs font-mono font-medium text-text-muted">
                {wsConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 shrink-0">
            <div className="bg-surface-1 border border-surface-2 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1">Session</span>
              <span className="text-2xl font-mono font-bold">{formatTime(sessionSeconds)}</span>
            </div>
            <div className="bg-surface-1 border border-surface-2 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden group">
              <span className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1">Drowsy Events</span>
              <span className="text-2xl font-bold font-mono">{eyesClosedEvents}</span>
              <Activity className="absolute right-4 bottom-4 text-warning/10 group-hover:text-warning/30 transition-colors w-12 h-12" />
            </div>
            <div className="bg-surface-1 border border-surface-2 rounded-xl p-4 flex flex-col justify-center relative overflow-hidden group">
              <span className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-1">Total Alerts</span>
              <span className="text-2xl font-bold font-mono text-danger">{alertsTriggered}</span>
              <ShieldAlert className="absolute right-4 bottom-4 text-danger/10 group-hover:text-danger/30 transition-colors w-12 h-12" />
            </div>
          </div>
        </div>

        {/* Right Area: EAR Panel */}
        <div className="w-full lg:w-72 bg-surface-1 rounded-2xl border border-surface-2 p-6 flex flex-col h-full shrink-0">
          <div className="mb-6">
            <h3 className="font-heading font-bold text-lg mb-1 flex items-center gap-2">
              EAR Metrics
            </h3>
            <p className="text-xs text-text-muted">Eye Aspect Ratio measurement</p>
          </div>

          <div className="flex-1 flex flex-row items-center justify-center gap-8 py-4 relative">
            <div className="relative h-full w-24 bg-surface-2 rounded-[2rem] p-2 flex flex-col-reverse shadow-inner border border-black/50">
              {/* Threshold Marker */}
              <div
                className="absolute left-0 right-0 border-t-2 border-warning z-10 border-dashed"
                style={{ bottom: `${(threshold / 0.5) * 100}%` }}
              >
                <div className="absolute right-full mr-2 transform translate-y-[-50%] text-xs font-mono font-bold text-warning whitespace-nowrap">
                  {threshold.toFixed(2)}
                </div>
              </div>

              {/* Dynamic Fill Bar */}
              <div
                className={`w-full rounded-[1.5rem] transition-all duration-300 ease-out relative overflow-hidden ${ear < threshold ? 'bg-danger shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-safe shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}
                style={{ height: `${earPercentage}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/40" />
              </div>
            </div>
          </div>

          <div className="mt-6 text-center bg-surface-2 rounded-lg py-4 border border-surface-2 shadow-inner">
            <span className="text-xs text-text-muted font-semibold uppercase tracking-widest block mb-1">Current Value</span>
            <span className={`text-4xl font-mono font-bold transition-colors ${ear < threshold ? 'text-danger' : 'text-safe'}`}>
              {ear.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Full Screen Alarm Overlay */}
      {status === 'ALERT' && (
        <div className="fixed inset-0 z-50 bg-danger/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/20 animate-pulse mix-blend-overlay pointer-events-none" />

          <div className="relative flex flex-col items-center">
            <AlertTriangle className="text-white w-32 h-32 mb-8 animate-bounce" />
            <h1 className="text-white text-5xl md:text-7xl font-black mb-12 tracking-widest text-center px-4 drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] uppercase font-heading">
              Drowsiness<br/>Detected
            </h1>
            <button
              onClick={() => setStatus('SAFE')}
              className="px-12 py-5 bg-white text-danger text-2xl font-bold rounded-full shadow-[0_0_40px_rgba(255,255,255,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 uppercase tracking-widest border-4 border-white/50"
            >
              I&apos;m Awake
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
