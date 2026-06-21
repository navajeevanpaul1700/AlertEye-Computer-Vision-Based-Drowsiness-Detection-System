import Link from "next/link";
import { 
  Camera, 
  BrainCircuit, 
  BellRing, 
  Activity, 
  FileClock, 
  SlidersHorizontal, 
  ShieldCheck 
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background Animated Orb */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/15 rounded-full blur-[120px] -z-10 animate-pulse" />

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 md:py-32">
        <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight mb-6 mt-8">
          Stay Awake. <span className="text-accent">Stay Alive.</span>
        </h1>
        <p className="max-w-2xl text-lg md:text-xl text-text-muted mb-10 leading-relaxed">
          AI-powered drowsiness detection via your webcam. 
          Protect yourself and others with real-time monitoring that alerts you the moment you start to lose focus.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/monitor"
            className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-8 text-base font-semibold text-primary shadow-lg transition-all hover:bg-accent/90 hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)]"
          >
            Start Monitoring
          </Link>
          <a 
            href="#how-it-works"
            className="inline-flex h-12 items-center justify-center rounded-md border border-surface-2 bg-transparent px-8 text-base font-medium text-text-primary transition-colors hover:bg-surface-2 hover:text-white"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-surface-1/50 border-y border-surface-2">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-text-muted max-w-xl mx-auto">Three simple steps to keep your journey safe and monitored.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-surface-1 border border-surface-2/50 group hover:border-accent/30 transition-colors">
              <div className="absolute -top-4 w-8 h-8 rounded-full bg-accent text-primary font-bold flex items-center justify-center">1</div>
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform">
                <Camera size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Allow Camera Access</h3>
              <p className="text-text-muted text-sm leading-relaxed">Simply grant permission to use your webcam. No software installation required.</p>
            </div>
            
            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-surface-1 border border-surface-2/50 group hover:border-accent/30 transition-colors">
              <div className="absolute -top-4 w-8 h-8 rounded-full bg-accent text-primary font-bold flex items-center justify-center">2</div>
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform">
                <BrainCircuit size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Monitors Your Eyes</h3>
              <p className="text-text-muted text-sm leading-relaxed">Our advanced models track facial landmarks and calculate your Eye Aspect Ratio (EAR) in real-time.</p>
            </div>
            
            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-surface-1 border border-surface-2/50 group hover:border-accent/30 transition-colors">
              <div className="absolute -top-4 w-8 h-8 rounded-full bg-accent text-primary font-bold flex items-center justify-center">3</div>
              <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mb-6 text-danger group-hover:scale-110 transition-transform">
                <BellRing size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Alarm Triggers Instantly</h3>
              <p className="text-text-muted text-sm leading-relaxed">The moment signs of microsleep are detected, high-visibility visual and audio alerts wake you up.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Powerful Safety Features</h2>
            <p className="text-text-muted max-w-xl mx-auto">Everything you need for reliable driver drowsiness detection.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-surface-1 border border-surface-2 hover:-translate-y-1 hover:border-accent/50 transition-all duration-300">
              <Activity className="text-accent mb-4" size={28} />
              <h4 className="text-lg font-bold mb-2">Real-time Detection</h4>
              <p className="text-text-muted text-sm">Lightning fast frame processing entirely in your browser. Zero latency.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-surface-1 border border-surface-2 hover:-translate-y-1 hover:border-accent/50 transition-all duration-300">
              <BellRing className="text-accent mb-4" size={28} />
              <h4 className="text-lg font-bold mb-2">Smart Alarm System</h4>
              <p className="text-text-muted text-sm">Gradual pulsing warnings upgrading to full siren alerts if drowsiness persists.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-surface-1 border border-surface-2 hover:-translate-y-1 hover:border-accent/50 transition-all duration-300">
              <BrainCircuit className="text-accent mb-4" size={28} />
              <h4 className="text-lg font-bold mb-2">Head Pose Tracking</h4>
              <p className="text-text-muted text-sm">Monitors both eye closure and head nodding mechanics for accuracy.</p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-surface-1 border border-surface-2 hover:-translate-y-1 hover:border-accent/50 transition-all duration-300">
              <FileClock className="text-accent mb-4" size={28} />
              <h4 className="text-lg font-bold mb-2">Session History</h4>
              <p className="text-text-muted text-sm">Review your previous drives to analyze fatigue patterns and risk zones.</p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-surface-1 border border-surface-2 hover:-translate-y-1 hover:border-accent/50 transition-all duration-300">
              <SlidersHorizontal className="text-accent mb-4" size={28} />
              <h4 className="text-lg font-bold mb-2">Adjustable Sensitivity</h4>
              <p className="text-text-muted text-sm">Calibrate the EAR threshold directly to match your unique eye shape.</p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-surface-1 border border-surface-2 hover:-translate-y-1 hover:border-accent/50 transition-all duration-300">
              <ShieldCheck className="text-accent mb-4" size={28} />
              <h4 className="text-lg font-bold mb-2">Zero Data Stored</h4>
              <p className="text-text-muted text-sm">100% privacy focused. Video never leaves your device and nothing is uploaded.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
